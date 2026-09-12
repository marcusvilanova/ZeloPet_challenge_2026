using Microsoft.EntityFrameworkCore;
using ZeloApi.Net.Data;
using ZeloApi.Net.Models;

namespace ZeloApi.Net.Repositories
{
    public class PetRepository : IPetRepository
    {
        private readonly ApplicationDbContext _context;

        public PetRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<Pet> Itens, int Total)> GetPagedAsync(string? nome, string? especie, int page, int size)
        {
            var query = _context.Pets
                .Include(p => p.PetTutores)
                .AsQueryable();

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(p => p.Nome.Contains(nome));
            }

            if (!string.IsNullOrEmpty(especie))
            {
                query = query.Where(p => p.Especie.Contains(especie));
            }

            var total = await query.CountAsync();

            var itens = await query
                .OrderBy(p => p.PetId)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return (itens, total);
        }

        public Task<Pet?> GetByIdAsync(long petId)
        {
            return _context.Pets
                .Include(p => p.PetTutores)
                .FirstOrDefaultAsync(p => p.PetId == petId);
        }

        public async Task<Pet> AddAsync(Pet pet)
        {
            _context.Pets.Add(pet);
            await _context.SaveChangesAsync();
            return pet;
        }

        public async Task UpdateAsync(Pet pet)
        {
            _context.Entry(pet).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(Pet pet)
        {
            _context.Pets.Remove(pet);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(long petId)
        {
            return await _context.Pets.CountAsync(p => p.PetId == petId) > 0;
        }
    }
}
