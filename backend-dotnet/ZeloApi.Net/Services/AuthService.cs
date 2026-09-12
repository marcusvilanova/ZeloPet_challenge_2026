using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using ZeloApi.Net.Auth;
using ZeloApi.Net.Dtos;
using ZeloApi.Net.Exceptions;
using ZeloApi.Net.Models;
using ZeloApi.Net.Repositories;

namespace ZeloApi.Net.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly ITokenService _tokenService;
        private readonly IPasswordHasher<Usuario> _passwordHasher;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            IUsuarioRepository usuarioRepository,
            ITokenService tokenService,
            IPasswordHasher<Usuario> passwordHasher,
            ILogger<AuthService> logger)
        {
            _usuarioRepository = usuarioRepository;
            _tokenService = tokenService;
            _passwordHasher = passwordHasher;
            _logger = logger;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
            var usuario = await _usuarioRepository.GetByEmailAsync(request.Email);

            if (usuario is null || usuario.SenhaHash is null || usuario.Ativo != 'S')
            {
                _logger.LogWarning("Tentativa de login falhou para o email {Email}", request.Email);
                throw new UnauthorizedException("Email ou senha inválidos");
            }

            var resultado = _passwordHasher.VerifyHashedPassword(usuario, usuario.SenhaHash, request.Senha);
            if (resultado == PasswordVerificationResult.Failed)
            {
                _logger.LogWarning("Tentativa de login falhou para o email {Email}", request.Email);
                throw new UnauthorizedException("Email ou senha inválidos");
            }

            var (token, expiraEm) = _tokenService.GerarToken(usuario);

            _logger.LogInformation("Login realizado com sucesso para o usuário {UsuarioId}", usuario.UsuarioId);

            return new LoginResponseDto
            {
                Token = token,
                ExpiraEm = expiraEm,
                UsuarioId = usuario.UsuarioId,
                Nome = usuario.Nome,
                Email = usuario.Email,
                TipoUsuario = usuario.TipoUsuario
            };
        }
    }
}
