using ZeloApi.Net.Models;

namespace ZeloApi.Net.Auth
{
    public interface ITokenService
    {
        (string Token, DateTime ExpiraEm) GerarToken(Usuario usuario);
    }
}
