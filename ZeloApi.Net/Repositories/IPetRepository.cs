using ZeloApi.Net.Models;

namespace ZeloApi.Net.Repositories
{
    public interface IPetRepository
    {
        Task<(IEnumerable<Pet> Itens, int Total)> GetPagedAsync(string? nome, string? especie, int page, int size);
        Task<Pet?> GetByIdAsync(long petId);
        Task<Pet> AddAsync(Pet pet);
        Task UpdateAsync(Pet pet);
        Task RemoveAsync(Pet pet);
        Task<bool> ExistsAsync(long petId);
    }
}
