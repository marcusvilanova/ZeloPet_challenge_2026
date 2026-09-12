using Microsoft.EntityFrameworkCore;
using ZeloApi.Net.Data;
using ZeloApi.Net.Models;

namespace ZeloApi.Net.Repositories
{
    public class TutorRepository : ITutorRepository
    {
        private readonly ApplicationDbContext _context;

        public TutorRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<Tutor> Itens, int Total)> GetPagedAsync(string? nome, int page, int size)
        {
            var query = _context.Tutores
                .Include(t => t.Usuario)
                .Include(t => t.PetTutores)
                .AsQueryable();

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(t => t.Usuario!.Nome.Contains(nome));
            }

            var total = await query.CountAsync();

            var itens = await query
                .OrderBy(t => t.TutorId)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return (itens, total);
        }

        public Task<Tutor?> GetByIdAsync(long tutorId)
        {
            return _context.Tutores
                .Include(t => t.Usuario)
                .Include(t => t.PetTutores)
                .FirstOrDefaultAsync(t => t.TutorId == tutorId);
        }

        public async Task<Tutor> AddAsync(Tutor tutor)
        {
            _context.Tutores.Add(tutor);
            await _context.SaveChangesAsync();
            return tutor;
        }

        public async Task UpdateAsync(Tutor tutor)
        {
            _context.Entry(tutor).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(Tutor tutor)
        {
            _context.Tutores.Remove(tutor);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(long tutorId)
        {
            return await _context.Tutores.CountAsync(t => t.TutorId == tutorId) > 0;
        }
    }
}
