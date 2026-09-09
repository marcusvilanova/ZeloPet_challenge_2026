using ZeloApi.Net.Dtos;

namespace ZeloApi.Net.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
    }
}
