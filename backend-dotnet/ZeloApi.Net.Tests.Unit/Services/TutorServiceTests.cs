using Microsoft.AspNetCore.Identity;
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
    public class TutorServiceTests
    {
        private readonly Mock<ITutorRepository> _tutorRepositoryMock = new();
        private readonly Mock<IUsuarioRepository> _usuarioRepositoryMock = new();
        private readonly Mock<IPasswordHasher<Usuario>> _passwordHasherMock = new();
        private readonly Mock<ILogger<TutorService>> _loggerMock = new();

        private TutorService CriarServico()
        {
            return new TutorService(
                _tutorRepositoryMock.Object,
                _usuarioRepositoryMock.Object,
                _passwordHasherMock.Object,
                _loggerMock.Object);
        }

        [Fact]
        public async Task CreateAsync_EmailNovo_CriaUsuarioETutor()
        {
            // Arrange
            var dto = new TutorCreateDto
            {
                Nome = "Ana Paula",
                Email = "ana@zelo.com",
                Senha = "senha123",
                Telefone = "11999999999",
                Cidade = "São Paulo",
                Estado = "SP"
            };

            _usuarioRepositoryMock.Setup(r => r.ExistsByEmailAsync(dto.Email)).ReturnsAsync(false);
            _passwordHasherMock
                .Setup(h => h.HashPassword(It.IsAny<Usuario>(), dto.Senha))
                .Returns("senha-hasheada");
            _usuarioRepositoryMock
                .Setup(r => r.AddAsync(It.IsAny<Usuario>()))
                .ReturnsAsync((Usuario u) => { u.UsuarioId = 10; return u; });
            _tutorRepositoryMock
                .Setup(r => r.AddAsync(It.IsAny<Tutor>()))
                .ReturnsAsync((Tutor t) => { t.TutorId = 5; return t; });

            var servico = CriarServico();

            // Act
            var resultado = await servico.CreateAsync(dto);

            // Assert
            Assert.Equal(5, resultado.TutorId);
            Assert.Equal(10, resultado.UsuarioId);
            Assert.Equal(dto.Nome, resultado.Nome);
            Assert.Equal(dto.Email, resultado.Email);
            _usuarioRepositoryMock.Verify(r => r.AddAsync(It.Is<Usuario>(u => u.SenhaHash == "senha-hasheada")), Times.Once);
        }

        [Fact]
        public async Task CreateAsync_EmailJaCadastrado_LancaConflictException()
        {
            // Arrange
            var dto = new TutorCreateDto { Nome = "Duplicado", Email = "existente@zelo.com", Senha = "senha123" };
            _usuarioRepositoryMock.Setup(r => r.ExistsByEmailAsync(dto.Email)).ReturnsAsync(true);

            var servico = CriarServico();

            // Act & Assert
            await Assert.ThrowsAsync<ConflictException>(() => servico.CreateAsync(dto));
            _tutorRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Tutor>()), Times.Never);
        }

        [Fact]
        public async Task GetByIdAsync_TutorExistente_RetornaTutor()
        {
            // Arrange
            var tutor = new Tutor
            {
                TutorId = 7,
                UsuarioId = 20,
                Usuario = new Usuario { UsuarioId = 20, Nome = "Carlos", Email = "carlos@zelo.com" }
            };
            _tutorRepositoryMock.Setup(r => r.GetByIdAsync(7)).ReturnsAsync(tutor);

            var servico = CriarServico();

            // Act
            var resultado = await servico.GetByIdAsync(7);

            // Assert
            Assert.Equal(7, resultado.TutorId);
            Assert.Equal("Carlos", resultado.Nome);
        }

        [Fact]
        public async Task GetByIdAsync_TutorInexistente_LancaNotFoundException()
        {
            // Arrange
            _tutorRepositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<long>())).ReturnsAsync((Tutor?)null);
            var servico = CriarServico();

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => servico.GetByIdAsync(999));
        }

        [Fact]
        public async Task UpdateAsync_TutorInexistente_LancaNotFoundException()
        {
            // Arrange
            _tutorRepositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<long>())).ReturnsAsync((Tutor?)null);
            var servico = CriarServico();
            var dto = new TutorUpdateDto { Nome = "Novo Nome" };

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => servico.UpdateAsync(999, dto));
        }

        [Fact]
        public async Task DeleteAsync_TutorExistente_RemoveTutor()
        {
            // Arrange
            var tutor = new Tutor { TutorId = 3, UsuarioId = 30 };
            _tutorRepositoryMock.Setup(r => r.GetByIdAsync(3)).ReturnsAsync(tutor);

            var servico = CriarServico();

            // Act
            await servico.DeleteAsync(3);

            // Assert
            _tutorRepositoryMock.Verify(r => r.RemoveAsync(tutor), Times.Once);
        }
    }
}
