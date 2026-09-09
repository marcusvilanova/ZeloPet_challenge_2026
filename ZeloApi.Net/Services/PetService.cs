using Microsoft.Extensions.Logging;
using ZeloApi.Net.Dtos;
using ZeloApi.Net.Exceptions;
using ZeloApi.Net.Models;
using ZeloApi.Net.Repositories;

namespace ZeloApi.Net.Services
{
    public class PetService : IPetService
    {
        private readonly IPetRepository _petRepository;
        private readonly ITutorRepository _tutorRepository;
        private readonly ILogger<PetService> _logger;

        public PetService(IPetRepository petRepository, ITutorRepository tutorRepository, ILogger<PetService> logger)
        {
            _petRepository = petRepository;
            _tutorRepository = tutorRepository;
            _logger = logger;
        }

        public async Task<(IEnumerable<PetResponseDto> Itens, int Total)> GetPagedAsync(string? nome, string? especie, int page, int size)
        {
            var (itens, total) = await _petRepository.GetPagedAsync(nome, especie, page, size);
            return (itens.Select(Mapear), total);
        }

        public async Task<PetResponseDto> GetByIdAsync(long petId)
        {
            var pet = await _petRepository.GetByIdAsync(petId)
                ?? throw new NotFoundException($"Pet {petId} não encontrado");

            return Mapear(pet);
        }

        public async Task<PetResponseDto> CreateAsync(PetCreateDto dto)
        {
            if (!await _tutorRepository.ExistsAsync(dto.TutorId))
            {
                _logger.LogWarning("Tentativa de cadastro de pet para tutor inexistente {TutorId}", dto.TutorId);
                throw new NotFoundException($"Tutor {dto.TutorId} não encontrado");
            }

            var pet = new Pet
            {
                Nome = dto.Nome,
                Especie = dto.Especie,
                Raca = dto.Raca,
                Sexo = dto.Sexo,
                DataNascimento = dto.DataNascimento,
                PesoKg = dto.PesoKg,
                Castrado = dto.Castrado
            };

            pet.PetTutores.Add(new PetTutor
            {
                TutorId = dto.TutorId,
                ResponsavelPrincipal = 'S'
            });

            var petCriado = await _petRepository.AddAsync(pet);

            _logger.LogInformation("Pet {PetId} cadastrado para o tutor {TutorId}", petCriado.PetId, dto.TutorId);

            return Mapear(petCriado);
        }

        public async Task UpdateAsync(long petId, PetUpdateDto dto)
        {
            var pet = await _petRepository.GetByIdAsync(petId)
                ?? throw new NotFoundException($"Pet {petId} não encontrado");

            pet.Nome = dto.Nome;
            pet.Especie = dto.Especie;
            pet.Raca = dto.Raca;
            pet.Sexo = dto.Sexo;
            pet.DataNascimento = dto.DataNascimento;
            pet.PesoKg = dto.PesoKg;
            pet.Castrado = dto.Castrado;

            await _petRepository.UpdateAsync(pet);

            _logger.LogInformation("Pet {PetId} atualizado", petId);
        }

        public async Task DeleteAsync(long petId)
        {
            var pet = await _petRepository.GetByIdAsync(petId)
                ?? throw new NotFoundException($"Pet {petId} não encontrado");

            await _petRepository.RemoveAsync(pet);

            _logger.LogInformation("Pet {PetId} removido", petId);
        }

        private static PetResponseDto Mapear(Pet pet)
        {
            return new PetResponseDto
            {
                PetId = pet.PetId,
                Nome = pet.Nome,
                Especie = pet.Especie,
                Raca = pet.Raca,
                Sexo = pet.Sexo,
                DataNascimento = pet.DataNascimento,
                PesoKg = pet.PesoKg,
                Castrado = pet.Castrado,
                CriadoEm = pet.CriadoEm,
                TutorIds = pet.PetTutores.Select(pt => pt.TutorId).ToList()
            };
        }
    }
}
