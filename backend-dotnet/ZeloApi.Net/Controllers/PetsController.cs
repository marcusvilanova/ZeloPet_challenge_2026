using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZeloApi.Net.Dtos;
using ZeloApi.Net.Services;

namespace ZeloApi.Net.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PetsController : ControllerBase
    {
        private readonly IPetService _petService;

        public PetsController(IPetService petService)
        {
            _petService = petService;
        }

        /// <summary>
        /// Retorna uma lista paginada de pets, com opção de busca por nome ou espécie.
        /// </summary>
        /// <param name="nome">Nome do pet para busca (opcional)</param>
        /// <param name="especie">Espécie do pet para busca (opcional)</param>
        /// <param name="page">Número da página (padrão: 1)</param>
        /// <param name="size">Tamanho da página (padrão: 10)</param>
        /// <returns>Lista paginada de pets</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<PetResponseDto>>> GetPets(
            [FromQuery] string? nome,
            [FromQuery] string? especie,
            [FromQuery] int page = 1,
            [FromQuery] int size = 10)
        {
            var (itens, total) = await _petService.GetPagedAsync(nome, especie, page, size);
            var totalPages = (int)Math.Ceiling(total / (double)size);

            Response.Headers.Append("X-Total-Count", total.ToString());
            Response.Headers.Append("X-Total-Pages", totalPages.ToString());

            return Ok(itens);
        }

        /// <summary>
        /// Retorna um pet específico pelo ID.
        /// </summary>
        /// <param name="id">ID do pet</param>
        /// <returns>O pet encontrado</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PetResponseDto>> GetPet(long id)
        {
            var pet = await _petService.GetByIdAsync(id);
            return Ok(pet);
        }

        /// <summary>
        /// Cria um novo pet vinculado a um tutor existente.
        /// </summary>
        /// <param name="dto">Dados do novo pet</param>
        /// <returns>O pet criado</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PetResponseDto>> PostPet([FromBody] PetCreateDto dto)
        {
            var pet = await _petService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetPet), new { id = pet.PetId }, pet);
        }

        /// <summary>
        /// Atualiza um pet existente.
        /// </summary>
        /// <param name="id">ID do pet a ser atualizado</param>
        /// <param name="dto">Dados atualizados do pet</param>
        /// <returns>NoContent se sucesso</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PutPet(long id, [FromBody] PetUpdateDto dto)
        {
            await _petService.UpdateAsync(id, dto);
            return NoContent();
        }

        /// <summary>
        /// Remove um pet existente.
        /// </summary>
        /// <param name="id">ID do pet a ser removido</param>
        /// <returns>NoContent se sucesso</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeletePet(long id)
        {
            await _petService.DeleteAsync(id);
            return NoContent();
        }
    }
}
