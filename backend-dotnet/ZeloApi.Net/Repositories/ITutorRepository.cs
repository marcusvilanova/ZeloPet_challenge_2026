using ZeloApi.Net.Models;

namespace ZeloApi.Net.Repositories
{
    public interface ITutorRepository
    {
        Task<(IEnumerable<Tutor> Itens, int Total)> GetPagedAsync(string? nome, int page, int size);
        Task<Tutor?> GetByIdAsync(long tutorId);
        Task<Tutor> AddAsync(Tutor tutor);
        Task UpdateAsync(Tutor tutor);
        Task RemoveAsync(Tutor tutor);
        Task<bool> ExistsAsync(long tutorId);
    }
}
