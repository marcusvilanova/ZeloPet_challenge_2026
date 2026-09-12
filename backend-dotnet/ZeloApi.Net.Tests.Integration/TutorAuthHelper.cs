using System.Net.Http.Json;
using ZeloApi.Net.Dtos;

namespace ZeloApi.Net.Tests.Integration
{
    internal static class TutorAuthHelper
    {
        public static async Task<(TutorResponseDto Tutor, string Token)> RegistrarELogarAsync(HttpClient client, string? emailPrefixo = null)
        {
            var email = $"{emailPrefixo ?? "tutor"}-{Guid.NewGuid():N}@zelo.com";

            var createDto = new TutorCreateDto
            {
                Nome = "Tutor de Teste",
                Email = email,
                Senha = "senhaSegura123",
                Telefone = "11988887777",
                Cidade = "São Paulo",
                Estado = "SP"
            };

            var createResponse = await client.PostAsJsonAsync("/api/tutores", createDto);
            createResponse.EnsureSuccessStatusCode();
            var tutor = (await createResponse.Content.ReadFromJsonAsync<TutorResponseDto>())!;

            var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new LoginRequestDto
            {
                Email = email,
                Senha = createDto.Senha
            });
            loginResponse.EnsureSuccessStatusCode();
            var login = (await loginResponse.Content.ReadFromJsonAsync<LoginResponseDto>())!;

            return (tutor, login.Token);
        }
    }
}
