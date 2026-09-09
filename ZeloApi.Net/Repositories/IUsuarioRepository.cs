using ZeloApi.Net.Models;

namespace ZeloApi.Net.Repositories
{
    public interface IUsuarioRepository
    {
        Task<Usuario?> GetByEmailAsync(string email);
        Task<Usuario?> GetByIdAsync(long usuarioId);
        Task<bool> ExistsByEmailAsync(string email);
        Task<Usuario> AddAsync(Usuario usuario);
    }
}
