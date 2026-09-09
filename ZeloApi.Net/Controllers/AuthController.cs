using Microsoft.AspNetCore.Mvc;
using ZeloApi.Net.Dtos;
using ZeloApi.Net.Services;

namespace ZeloApi.Net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Autentica um usuário e retorna um token JWT.
        /// </summary>
        /// <param name="request">Email e senha do usuário</param>
        /// <returns>Token JWT e dados básicos do usuário autenticado</returns>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto request)
        {
            var resultado = await _authService.LoginAsync(request);
            return Ok(resultado);
        }
    }
}
