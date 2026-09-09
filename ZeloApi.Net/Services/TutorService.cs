using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using ZeloApi.Net.Dtos;
using ZeloApi.Net.Exceptions;
using ZeloApi.Net.Models;
using ZeloApi.Net.Repositories;

namespace ZeloApi.Net.Services
{
    public class TutorService : ITutorService
    {
        private readonly ITutorRepository _tutorRepository;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IPasswordHasher<Usuario> _passwordHasher;
        private readonly ILogger<TutorService> _logger;

        public TutorService(
            ITutorRepository tutorRepository,
            IUsuarioRepository usuarioRepository,
            IPasswordHasher<Usuario> passwordHasher,
            ILogger<TutorService> logger)
        {
            _tutorRepository = tutorRepository;
            _usuarioRepository = usuarioRepository;
            _passwordHasher = passwordHasher;
            _logger = logger;
        }

        public async Task<(IEnumerable<TutorResponseDto> Itens, int Total)> GetPagedAsync(string? nome, int page, int size)
        {
            var (itens, total) = await _tutorRepository.GetPagedAsync(nome, page, size);
            return (itens.Select(Mapear), total);
        }

        public async Task<TutorResponseDto> GetByIdAsync(long tutorId)
        {
            var tutor = await _tutorRepository.GetByIdAsync(tutorId)
                ?? throw new NotFoundException($"Tutor {tutorId} não encontrado");

            return Mapear(tutor);
        }

        public async Task<TutorResponseDto> CreateAsync(TutorCreateDto dto)
        {
            if (await _usuarioRepository.ExistsByEmailAsync(dto.Email))
            {
                _logger.LogWarning("Tentativa de cadastro com email já existente {Email}", dto.Email);
                throw new ConflictException($"Já existe um usuário cadastrado com o email {dto.Email}");
            }

            var usuario = new Usuario
            {
                Nome = dto.Nome,
                Email = dto.Email,
                TipoUsuario = ZeloApi.Net.Models.TipoUsuario.Tutor,
                Ativo = 'S'
            };
            usuario.SenhaHash = _passwordHasher.HashPassword(usuario, dto.Senha);

            var usuarioCriado = await _usuarioRepository.AddAsync(usuario);

            var tutor = new Tutor
            {
                UsuarioId = usuarioCriado.UsuarioId,
                Telefone = dto.Telefone,
                Cidade = dto.Cidade,
                Estado = dto.Estado
            };

            var tutorCriado = await _tutorRepository.AddAsync(tutor);
            tutorCriado.Usuario = usuarioCriado;

            _logger.LogInformation("Tutor {TutorId} cadastrado para o usuário {UsuarioId}", tutorCriado.TutorId, usuarioCriado.UsuarioId);

            return Mapear(tutorCriado);
        }

        public async Task UpdateAsync(long tutorId, TutorUpdateDto dto)
        {
            var tutor = await _tutorRepository.GetByIdAsync(tutorId)
                ?? throw new NotFoundException($"Tutor {tutorId} não encontrado");

            if (tutor.Usuario is not null)
            {
                tutor.Usuario.Nome = dto.Nome;
            }
            tutor.Telefone = dto.Telefone;
            tutor.Cidade = dto.Cidade;
            tutor.Estado = dto.Estado;

            await _tutorRepository.UpdateAsync(tutor);

            _logger.LogInformation("Tutor {TutorId} atualizado", tutorId);
        }

        public async Task DeleteAsync(long tutorId)
        {
            var tutor = await _tutorRepository.GetByIdAsync(tutorId)
                ?? throw new NotFoundException($"Tutor {tutorId} não encontrado");

            await _tutorRepository.RemoveAsync(tutor);

            _logger.LogInformation("Tutor {TutorId} removido", tutorId);
        }

        private static TutorResponseDto Mapear(Tutor tutor)
        {
            return new TutorResponseDto
            {
                TutorId = tutor.TutorId,
                UsuarioId = tutor.UsuarioId,
                Nome = tutor.Usuario?.Nome ?? string.Empty,
                Email = tutor.Usuario?.Email ?? string.Empty,
                Telefone = tutor.Telefone,
                Cidade = tutor.Cidade,
                Estado = tutor.Estado,
                CriadoEm = tutor.CriadoEm,
                PetIds = tutor.PetTutores.Select(pt => pt.PetId).ToList()
            };
        }
    }
}
