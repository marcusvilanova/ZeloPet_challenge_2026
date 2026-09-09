namespace ZeloApi.Net.HealthChecks
{
    public class ExternalServiceOptions
    {
        public const string SectionName = "HealthChecks:ExternalService";

        public string Nome { get; set; } = "Serviço externo";
        public string? Url { get; set; }
        public int TimeoutSeconds { get; set; } = 5;
    }
}
