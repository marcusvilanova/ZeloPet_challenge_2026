using Serilog.Context;

namespace ZeloApi.Net.Middleware
{
    public class CorrelationIdMiddleware
    {
        private const string HeaderName = "X-Correlation-Id";

        private readonly RequestDelegate _next;

        public CorrelationIdMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var correlationId = context.Request.Headers.TryGetValue(HeaderName, out var valorRecebido)
                ? valorRecebido.ToString()
                : Guid.NewGuid().ToString();

            context.Response.Headers[HeaderName] = correlationId;

            // Publicado no LogContext do Serilog: como o contexto é AsyncLocal, o mesmo
            // CorrelationId aparece em todo log emitido por Controller, Service e Repository
            // durante essa requisição, permitindo rastrear a chamada entre as camadas.
            using (LogContext.PushProperty("CorrelationId", correlationId))
            {
                await _next(context);
            }
        }
    }
}
