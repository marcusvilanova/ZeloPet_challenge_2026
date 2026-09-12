using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;

namespace ZeloApi.Net.HealthChecks
{
    public class ExternalServiceHealthCheck : IHealthCheck
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ExternalServiceOptions _options;

        public ExternalServiceHealthCheck(IHttpClientFactory httpClientFactory, IOptions<ExternalServiceOptions> options)
        {
            _httpClientFactory = httpClientFactory;
            _options = options.Value;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context,
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(_options.Url))
            {
                return HealthCheckResult.Degraded($"{_options.Nome} não configurado (HealthChecks:ExternalService:Url)");
            }

            try
            {
                var client = _httpClientFactory.CreateClient(nameof(ExternalServiceHealthCheck));
                client.Timeout = TimeSpan.FromSeconds(_options.TimeoutSeconds);

                using var response = await client.GetAsync(_options.Url, cancellationToken);

                return response.IsSuccessStatusCode
                    ? HealthCheckResult.Healthy($"{_options.Nome} disponível ({(int)response.StatusCode})")
                    : HealthCheckResult.Degraded($"{_options.Nome} respondeu com status {(int)response.StatusCode}");
            }
            catch (Exception ex)
            {
                return HealthCheckResult.Degraded($"{_options.Nome} indisponível no momento", ex);
            }
        }
    }
}
