using System.Net;
using Xunit;

namespace ZeloApi.Net.Tests.Integration
{
    [Collection(ApiTestCollection.Name)]
    public class HealthCheckEndpointsTests
    {
        private readonly HttpClient _client;

        public HealthCheckEndpointsTests(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetHealth_RetornaOkComCorpoJson()
        {
            // Act
            var response = await _client.GetAsync("/health");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var corpo = await response.Content.ReadAsStringAsync();
            Assert.Contains("status", corpo);
            Assert.Contains("checks", corpo);
        }

        [Fact]
        public async Task GetHealthLive_RetornaOk()
        {
            // Act
            var response = await _client.GetAsync("/health/live");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetMetrics_RetornaOk()
        {
            // Act
            var response = await _client.GetAsync("/metrics");

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
