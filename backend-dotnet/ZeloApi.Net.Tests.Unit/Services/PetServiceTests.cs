using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using ZeloApi.Net.Dtos;
using ZeloApi.Net.Exceptions;
using ZeloApi.Net.Models;
using ZeloApi.Net.Repositories;
using ZeloApi.Net.Services;

namespace ZeloApi.Net.Tests.Unit.Services
{
    public class PetServiceTests
    {
        private readonly Mock<IPetRepository> _petRepositoryMock = new();
        private readonly Mock<ITutorRepository> _tutorRepositoryMock = new();
        private readonly Mock<ILogger<PetService>> _loggerMock = new();

        private PetService CriarServico()
        {
            return new PetService(_petRepositoryMock.Object, _tutorRepositoryMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task CreateAsync_TutorExistente_CriaPetVinculadoAoTutor()
        {
            // Arrange
            var dto = new PetCreateDto { Nome = "Rex", Especie = "Cachorro", TutorId = 1 };
            _tutorRepositoryMock.Setup(r => r.ExistsAsync(dto.TutorId)).ReturnsAsync(true);
            _petRepositoryMock
                .Setup(r => r.AddAsync(It.IsAny<Pet>()))
                .ReturnsAsync((Pet p) => { p.PetId = 42; return p; });

            var servico = CriarServico();

            // Act
            var resultado = await servico.CreateAsync(dto);

            // Assert
            Assert.Equal(42, resultado.PetId);
            Assert.Equal("Rex", resultado.Nome);
            Assert.Contains(dto.TutorId, resultado.TutorIds);
        }

        [Fact]
        public async Task CreateAsync_TutorInexistente_LancaNotFoundException()
        {
            // Arrange
            var dto = new PetCreateDto { Nome = "Bidu", Especie = "Cachorro", TutorId = 999 };
            _tutorRepositoryMock.Setup(r => r.ExistsAsync(dto.TutorId)).ReturnsAsync(false);

            var servico = CriarServico();

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => servico.CreateAsync(dto));
            _petRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Pet>()), Times.Never);
        }

        [Fact]
        public async Task GetByIdAsync_PetInexistente_LancaNotFoundException()
        {
            // Arrange
            _petRepositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<long>())).ReturnsAsync((Pet?)null);
            var servico = CriarServico();

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => servico.GetByIdAsync(123));
        }

        [Fact]
        public async Task UpdateAsync_PetExistente_AtualizaDadosDoPet()
        {
            // Arrange
            var pet = new Pet { PetId = 8, Nome = "Nome Antigo", Especie = "Gato" };
            _petRepositoryMock.Setup(r => r.GetByIdAsync(8)).ReturnsAsync(pet);
            var dto = new PetUpdateDto { Nome = "Nome Novo", Especie = "Gato", PesoKg = 4.5m };

            var servico = CriarServico();

            // Act
            await servico.UpdateAsync(8, dto);

            // Assert
            Assert.Equal("Nome Novo", pet.Nome);
            Assert.Equal(4.5m, pet.PesoKg);
            _petRepositoryMock.Verify(r => r.UpdateAsync(pet), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_PetInexistente_LancaNotFoundException()
        {
            // Arrange
            _petRepositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<long>())).ReturnsAsync((Pet?)null);
            var servico = CriarServico();

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => servico.DeleteAsync(555));
        }
    }
}
