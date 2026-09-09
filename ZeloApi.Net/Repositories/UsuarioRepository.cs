using Microsoft.EntityFrameworkCore;
using ZeloApi.Net.Data;
using ZeloApi.Net.Models;

namespace ZeloApi.Net.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly ApplicationDbContext _context;

        public UsuarioRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<Usuario?> GetByEmailAsync(string email)
        {
            return _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
        }

        public Task<Usuario?> GetByIdAsync(long usuarioId)
        {
            return _context.Usuarios.FirstOrDefaultAsync(u => u.UsuarioId == usuarioId);
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            // Oracle.EntityFrameworkCore não traduz AnyAsync(predicate) corretamente
            // (gera "= FALSE", que o Oracle rejeita com ORA-00904); CountAsync evita isso.
            return await _context.Usuarios.CountAsync(u => u.Email == email) > 0;
        }

        public async Task<Usuario> AddAsync(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }
    }
}
