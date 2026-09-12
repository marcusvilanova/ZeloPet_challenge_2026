using ZeloApi.Net.Dtos;

namespace ZeloApi.Net.Services
{
    public interface ITutorService
    {
        Task<(IEnumerable<TutorResponseDto> Itens, int Total)> GetPagedAsync(string? nome, int page, int size);
        Task<TutorResponseDto> GetByIdAsync(long tutorId);
        Task<TutorResponseDto> CreateAsync(TutorCreateDto dto);
        Task UpdateAsync(long tutorId, TutorUpdateDto dto);
        Task DeleteAsync(long tutorId);
    }
}
