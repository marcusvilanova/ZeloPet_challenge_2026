using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Xunit;
using ZeloApi.Net.Dtos;

namespace ZeloApi.Net.Tests.Integration
{
    [Collection(ApiTestCollection.Name)]
    public class TutoresEndpointsTests
    {
        private readonly HttpClient _client;

        public TutoresEndpointsTests(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task PostTutor_DadosValidos_RetornaCreated()
        {
            // Arrange
            var dto = new TutorCreateDto
            {
                Nome = "Novo Tutor",
                Email = $"novo-{Guid.NewGuid():N}@zelo.com",
                Senha = "senha123456",
                Telefone = "11911112222",
                Cidade = "Campinas",
                Estado = "SP"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/tutores", dto);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            var tutor = await response.Content.ReadFromJsonAsync<TutorResponseDto>();
            Assert.NotNull(tutor);
            Assert.Equal(dto.Nome, tutor!.Nome);
            Assert.Equal(dto.Email, tutor.Email);
        }

        [Fact]
        public async Task PostTutor_EmailDuplicado_RetornaConflict()
        {
            // Arrange
            var email = $"duplicado-{Guid.NewGuid():N}@zelo.com";
            var dto = new TutorCreateDto { Nome = "Primeiro", Email = email, Senha = "senha123456" };
            await _client.PostAsJsonAsync("/api/tutores", dto);

            var dtoDuplicado = new TutorCreateDto { Nome = "Segundo", Email = email, Senha = "outrasenha123" };

            // Act
            var response = await _client.PostAsJsonAsync("/api/tutores", dtoDuplicado);

            // Assert
            Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        }

        [Fact]
        public async Task GetTutores_SemTokenDeAutenticacao_RetornaUnauthorized()
        {
            // Act
            var response = await _client.GetAsync("/api/tutores");

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task GetTutor_ComTokenValido_RetornaOkComOTutorCadastrado()
        {
            // Arrange
            var (tutor, token) = await TutorAuthHelper.RegistrarELogarAsync(_client, "consulta");
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act
            var response = await _client.GetAsync($"/api/tutores/{tutor.TutorId}");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var tutorRetornado = await response.Content.ReadFromJsonAsync<TutorResponseDto>();
            Assert.Equal(tutor.TutorId, tutorRetornado!.TutorId);

            _client.DefaultRequestHeaders.Authorization = null;
        }

        [Fact]
        public async Task GetTutor_IdInexistente_RetornaNotFound()
        {
            // Arrange
            var (_, token) = await TutorAuthHelper.RegistrarELogarAsync(_client, "naoencontrado");
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act
            var response = await _client.GetAsync("/api/tutores/999999");

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

            _client.DefaultRequestHeaders.Authorization = null;
        }
    }
}
