using Microsoft.Extensions.Diagnostics.HealthChecks;
using ZeloApi.Net.Data;

namespace ZeloApi.Net.HealthChecks
{
    public class DatabaseHealthCheck : IHealthCheck
    {
        private readonly ApplicationDbContext _context;

        public DatabaseHealthCheck(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var conectou = await _context.Database.CanConnectAsync(cancellationToken);

                return conectou
                    ? HealthCheckResult.Healthy("Conexão com o banco de dados Oracle estabelecida com sucesso")
                    : HealthCheckResult.Unhealthy("Não foi possível conectar ao banco de dados Oracle");
            }
            catch (Exception ex)
            {
                return HealthCheckResult.Unhealthy("Falha ao conectar ao banco de dados Oracle", ex);
            }
        }
    }
}
