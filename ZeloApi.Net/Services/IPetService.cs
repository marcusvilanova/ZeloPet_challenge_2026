using ZeloApi.Net.Dtos;

namespace ZeloApi.Net.Services
{
    public interface IPetService
    {
        Task<(IEnumerable<PetResponseDto> Itens, int Total)> GetPagedAsync(string? nome, string? especie, int page, int size);
        Task<PetResponseDto> GetByIdAsync(long petId);
        Task<PetResponseDto> CreateAsync(PetCreateDto dto);
        Task UpdateAsync(long petId, PetUpdateDto dto);
        Task DeleteAsync(long petId);
    }
}
