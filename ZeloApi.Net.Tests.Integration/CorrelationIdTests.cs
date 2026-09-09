using Xunit;

namespace ZeloApi.Net.Tests.Integration
{
    [Collection(ApiTestCollection.Name)]
    public class CorrelationIdTests
    {
        private readonly HttpClient _client;

        public CorrelationIdTests(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetHealth_SemCorrelationIdNoRequest_RespostaTrazCorrelationIdGerado()
        {
            // Act
            var response = await _client.GetAsync("/health");

            // Assert
            Assert.True(response.Headers.TryGetValues("X-Correlation-Id", out var valores));
            Assert.False(string.IsNullOrWhiteSpace(valores!.First()));
        }

        [Fact]
        public async Task GetHealth_ComCorrelationIdNoRequest_RespostaEcoaOMesmoValor()
        {
            // Arrange
            var correlationIdEnviado = Guid.NewGuid().ToString();
            var request = new HttpRequestMessage(HttpMethod.Get, "/health");
            request.Headers.Add("X-Correlation-Id", correlationIdEnviado);

            // Act
            var response = await _client.SendAsync(request);

            // Assert
            var correlationIdRecebido = response.Headers.GetValues("X-Correlation-Id").First();
            Assert.Equal(correlationIdEnviado, correlationIdRecebido);
        }

        [Fact]
        public async Task GetPet_IdInexistente_RespostaDeErroTrazOMesmoCorrelationIdDoCabecalho()
        {
            // Arrange
            var (_, token) = await TutorAuthHelper.RegistrarELogarAsync(_client, "correlacao");
            var correlationIdEnviado = Guid.NewGuid().ToString();
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/pets/999999");
            request.Headers.Add("X-Correlation-Id", correlationIdEnviado);
            request.Headers.Add("Authorization", $"Bearer {token}");

            // Act
            var response = await _client.SendAsync(request);
            var corpo = await response.Content.ReadAsStringAsync();

            // Assert
            Assert.Contains(correlationIdEnviado, corpo);
        }
    }
}
