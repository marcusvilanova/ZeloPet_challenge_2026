using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Xunit;
using ZeloApi.Net.Dtos;

namespace ZeloApi.Net.Tests.Integration
{
    [Collection(ApiTestCollection.Name)]
    public class PetsEndpointsTests
    {
        private readonly HttpClient _client;

        public PetsEndpointsTests(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task PostPet_TutorExistente_RetornaCreatedComPetVinculado()
        {
            // Arrange
            var (tutor, token) = await TutorAuthHelper.RegistrarELogarAsync(_client, "donoPet");
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var dto = new PetCreateDto { Nome = "Thor", Especie = "Cachorro", Raca = "Labrador", TutorId = tutor.TutorId };

            // Act
            var response = await _client.PostAsJsonAsync("/api/pets", dto);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            var pet = await response.Content.ReadFromJsonAsync<PetResponseDto>();
            Assert.NotNull(pet);
            Assert.Equal("Thor", pet!.Nome);
            Assert.Contains(tutor.TutorId, pet.TutorIds);

            _client.DefaultRequestHeaders.Authorization = null;
        }

        [Fact]
        public async Task PostPet_TutorInexistente_RetornaNotFound()
        {
            // Arrange
            var (_, token) = await TutorAuthHelper.RegistrarELogarAsync(_client, "semPet");
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var dto = new PetCreateDto { Nome = "Fantasma", Especie = "Gato", TutorId = 987654 };

            // Act
            var response = await _client.PostAsJsonAsync("/api/pets", dto);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

            _client.DefaultRequestHeaders.Authorization = null;
        }

        [Fact]
        public async Task PostPet_SemTokenDeAutenticacao_RetornaUnauthorized()
        {
            // Arrange
            var dto = new PetCreateDto { Nome = "Sem Dono", Especie = "Cachorro", TutorId = 1 };

            // Act
            var response = await _client.PostAsJsonAsync("/api/pets", dto);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task GetPet_IdInexistente_RetornaNotFound()
        {
            // Arrange
            var (_, token) = await TutorAuthHelper.RegistrarELogarAsync(_client, "consultaPet");
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act
            var response = await _client.GetAsync("/api/pets/999999");

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

            _client.DefaultRequestHeaders.Authorization = null;
        }

        [Fact]
        public async Task PutPet_DadosValidos_RetornaNoContentEAtualizaOPet()
        {
            // Arrange
            var (tutor, token) = await TutorAuthHelper.RegistrarELogarAsync(_client, "editaPet");
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var criarResponse = await _client.PostAsJsonAsync("/api/pets", new PetCreateDto
            {
                Nome = "Nome Original",
                Especie = "Gato",
                TutorId = tutor.TutorId
            });
            var petCriado = await criarResponse.Content.ReadFromJsonAsync<PetResponseDto>();

            var atualizarDto = new PetUpdateDto { Nome = "Nome Atualizado", Especie = "Gato", PesoKg = 3.2m };

            // Act
            var response = await _client.PutAsJsonAsync($"/api/pets/{petCriado!.PetId}", atualizarDto);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

            var consultaResponse = await _client.GetAsync($"/api/pets/{petCriado.PetId}");
            var petAtualizado = await consultaResponse.Content.ReadFromJsonAsync<PetResponseDto>();
            Assert.Equal("Nome Atualizado", petAtualizado!.Nome);

            _client.DefaultRequestHeaders.Authorization = null;
        }
    }
}
