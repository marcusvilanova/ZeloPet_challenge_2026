using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZeloApi.Net.Dtos;
using ZeloApi.Net.Services;

namespace ZeloApi.Net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TutoresController : ControllerBase
    {
        private readonly ITutorService _tutorService;

        public TutoresController(ITutorService tutorService)
        {
            _tutorService = tutorService;
        }

        /// <summary>
        /// Retorna uma lista paginada de tutores, com opção de busca por nome.
        /// </summary>
        /// <param name="nome">Nome do tutor para busca (opcional)</param>
        /// <param name="page">Número da página (padrão: 1)</param>
        /// <param name="size">Tamanho da página (padrão: 10)</param>
        /// <returns>Lista paginada de tutores</returns>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TutorResponseDto>>> GetTutores(
            [FromQuery] string? nome,
            [FromQuery] int page = 1,
            [FromQuery] int size = 10)
        {
            var (itens, total) = await _tutorService.GetPagedAsync(nome, page, size);
            var totalPages = (int)Math.Ceiling(total / (double)size);

            Response.Headers.Append("X-Total-Count", total.ToString());
            Response.Headers.Append("X-Total-Pages", totalPages.ToString());

            return Ok(itens);
        }

        /// <summary>
        /// Retorna um tutor específico pelo ID.
        /// </summary>
        /// <param name="id">ID do tutor</param>
        /// <returns>O tutor encontrado</returns>
        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TutorResponseDto>> GetTutor(long id)
        {
            var tutor = await _tutorService.GetByIdAsync(id);
            return Ok(tutor);
        }

        /// <summary>
        /// Cadastra um novo tutor (cria também o usuário de acesso correspondente).
        /// </summary>
        /// <param name="dto">Dados do novo tutor</param>
        /// <returns>O tutor criado</returns>
        [HttpPost]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<TutorResponseDto>> PostTutor([FromBody] TutorCreateDto dto)
        {
            var tutor = await _tutorService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetTutor), new { id = tutor.TutorId }, tutor);
        }

        /// <summary>
        /// Atualiza um tutor existente.
        /// </summary>
        /// <param name="id">ID do tutor a ser atualizado</param>
        /// <param name="dto">Dados atualizados do tutor</param>
        /// <returns>NoContent se sucesso</returns>
        [HttpPut("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutTutor(long id, [FromBody] TutorUpdateDto dto)
        {
            await _tutorService.UpdateAsync(id, dto);
            return NoContent();
        }

        /// <summary>
        /// Remove um tutor existente.
        /// </summary>
        /// <param name="id">ID do tutor a ser removido</param>
        /// <returns>NoContent se sucesso</returns>
        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteTutor(long id)
        {
            await _tutorService.DeleteAsync(id);
            return NoContent();
        }
    }
}
