using System.Net;
using System.Net.Http.Json;
using Xunit;
using ZeloApi.Net.Dtos;

namespace ZeloApi.Net.Tests.Integration
{
    [Collection(ApiTestCollection.Name)]
    public class AuthEndpointsTests
    {
        private readonly HttpClient _client;

        public AuthEndpointsTests(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task PostLogin_CredenciaisValidas_RetornaOkComToken()
        {
            // Arrange
            var email = $"login-ok-{Guid.NewGuid():N}@zelo.com";
            var senha = "senhaSegura123";

            await _client.PostAsJsonAsync("/api/tutores", new TutorCreateDto
            {
                Nome = "Usuário Login",
                Email = email,
                Senha = senha
            });

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequestDto
            {
                Email = email,
                Senha = senha
            });

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var corpo = await response.Content.ReadFromJsonAsync<LoginResponseDto>();
            Assert.NotNull(corpo);
            Assert.False(string.IsNullOrWhiteSpace(corpo!.Token));
            Assert.Equal(email, corpo.Email);
        }

        [Fact]
        public async Task PostLogin_SenhaIncorreta_RetornaUnauthorized()
        {
            // Arrange
            var email = $"login-falha-{Guid.NewGuid():N}@zelo.com";
            await _client.PostAsJsonAsync("/api/tutores", new TutorCreateDto
            {
                Nome = "Usuário Login Falho",
                Email = email,
                Senha = "senhaCorreta123"
            });

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequestDto
            {
                Email = email,
                Senha = "senhaErrada"
            });

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task PostLogin_UsuarioInexistente_RetornaUnauthorized()
        {
            // Arrange
            var request = new LoginRequestDto { Email = "naoexiste@zelo.com", Senha = "qualquer123" };

            // Act
            var response = await _client.PostAsJsonAsync("/api/auth/login", request);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
    }
}
