using System.Text.Json;
using ZeloApi.Net.Exceptions;

namespace ZeloApi.Net.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (NotFoundException ex)
            {
                await EscreverRespostaAsync(context, StatusCodes.Status404NotFound, ex.Message);
            }
            catch (ConflictException ex)
            {
                await EscreverRespostaAsync(context, StatusCodes.Status409Conflict, ex.Message);
            }
            catch (UnauthorizedException ex)
            {
                await EscreverRespostaAsync(context, StatusCodes.Status401Unauthorized, ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro não tratado ao processar {Method} {Path}", context.Request.Method, context.Request.Path);
                await EscreverRespostaAsync(context, StatusCodes.Status500InternalServerError, "Ocorreu um erro inesperado ao processar a requisição");
            }
        }

        private static Task EscreverRespostaAsync(HttpContext context, int statusCode, string mensagem)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var correlationId = context.Response.Headers["X-Correlation-Id"].ToString();
            var payload = JsonSerializer.Serialize(new { erro = mensagem, correlationId });
            return context.Response.WriteAsync(payload);
        }
    }
}
