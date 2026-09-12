using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using ZeloApi.Net.Auth;
using ZeloApi.Net.Dtos;
using ZeloApi.Net.Exceptions;
using ZeloApi.Net.Models;
using ZeloApi.Net.Repositories;
using ZeloApi.Net.Services;

namespace ZeloApi.Net.Tests.Unit.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUsuarioRepository> _usuarioRepositoryMock = new();
        private readonly Mock<ITokenService> _tokenServiceMock = new();
        private readonly Mock<IPasswordHasher<Usuario>> _passwordHasherMock = new();
        private readonly Mock<ILogger<AuthService>> _loggerMock = new();

        private AuthService CriarServico()
        {
            return new AuthService(
                _usuarioRepositoryMock.Object,
                _tokenServiceMock.Object,
                _passwordHasherMock.Object,
                _loggerMock.Object);
        }

        [Fact]
        public async Task LoginAsync_CredenciaisValidas_RetornaTokenComDadosDoUsuario()
        {
            // Arrange
            var usuario = new Usuario
            {
                UsuarioId = 1,
                Nome = "Maria Tutora",
                Email = "maria@zelo.com",
                SenhaHash = "hash-qualquer",
                TipoUsuario = TipoUsuario.Tutor,
                Ativo = 'S'
            };
            var request = new LoginRequestDto { Email = usuario.Email, Senha = "senha123" };
            var expiraEm = DateTime.UtcNow.AddHours(1);

            _usuarioRepositoryMock.Setup(r => r.GetByEmailAsync(usuario.Email)).ReturnsAsync(usuario);
            _passwordHasherMock
                .Setup(h => h.VerifyHashedPassword(usuario, usuario.SenhaHash, request.Senha))
                .Returns(PasswordVerificationResult.Success);
            _tokenServiceMock.Setup(t => t.GerarToken(usuario)).Returns(("token-gerado", expiraEm));

            var servico = CriarServico();

            // Act
            var resultado = await servico.LoginAsync(request);

            // Assert
            Assert.Equal("token-gerado", resultado.Token);
            Assert.Equal(usuario.UsuarioId, resultado.UsuarioId);
            Assert.Equal(usuario.Email, resultado.Email);
            Assert.Equal(expiraEm, resultado.ExpiraEm);
        }

        [Fact]
        public async Task LoginAsync_UsuarioNaoEncontrado_LancaUnauthorizedException()
        {
            // Arrange
            var request = new LoginRequestDto { Email = "inexistente@zelo.com", Senha = "senha123" };
            _usuarioRepositoryMock.Setup(r => r.GetByEmailAsync(request.Email)).ReturnsAsync((Usuario?)null);

            var servico = CriarServico();

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedException>(() => servico.LoginAsync(request));
        }

        [Fact]
        public async Task LoginAsync_SenhaIncorreta_LancaUnauthorizedException()
        {
            // Arrange
            var usuario = new Usuario
            {
                UsuarioId = 2,
                Nome = "João Tutor",
                Email = "joao@zelo.com",
                SenhaHash = "hash-qualquer",
                TipoUsuario = TipoUsuario.Tutor,
                Ativo = 'S'
            };
            var request = new LoginRequestDto { Email = usuario.Email, Senha = "senhaErrada" };

            _usuarioRepositoryMock.Setup(r => r.GetByEmailAsync(usuario.Email)).ReturnsAsync(usuario);
            _passwordHasherMock
                .Setup(h => h.VerifyHashedPassword(usuario, usuario.SenhaHash, request.Senha))
                .Returns(PasswordVerificationResult.Failed);

            var servico = CriarServico();

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedException>(() => servico.LoginAsync(request));
            _tokenServiceMock.Verify(t => t.GerarToken(It.IsAny<Usuario>()), Times.Never);
        }

        [Fact]
        public async Task LoginAsync_UsuarioInativo_LancaUnauthorizedException()
        {
            // Arrange
            var usuario = new Usuario
            {
                UsuarioId = 3,
                Nome = "Usuário Inativo",
                Email = "inativo@zelo.com",
                SenhaHash = "hash-qualquer",
                TipoUsuario = TipoUsuario.Tutor,
                Ativo = 'N'
            };
            var request = new LoginRequestDto { Email = usuario.Email, Senha = "senha123" };

            _usuarioRepositoryMock.Setup(r => r.GetByEmailAsync(usuario.Email)).ReturnsAsync(usuario);

            var servico = CriarServico();

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedException>(() => servico.LoginAsync(request));
        }
    }
}
