using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Options;
using Xunit;
using ZeloApi.Net.Auth;
using ZeloApi.Net.Models;

namespace ZeloApi.Net.Tests.Unit.Auth
{
    public class TokenServiceTests
    {
        private static TokenService CriarServico(JwtOptions? options = null)
        {
            options ??= new JwtOptions
            {
                Key = "chave-de-teste-com-tamanho-suficiente-para-hmac-sha256",
                Issuer = "ZeloApi.Net.Testes",
                Audience = "ZeloApi.Net.Testes.Clientes",
                ExpiryMinutes = 30
            };

            return new TokenService(Options.Create(options));
        }

        [Fact]
        public void GerarToken_UsuarioValido_RetornaTokenComClaimsEsperadas()
        {
            // Arrange
            var usuario = new Usuario
            {
                UsuarioId = 15,
                Nome = "Fernanda Vet",
                Email = "fernanda@zelo.com",
                TipoUsuario = TipoUsuario.Veterinario
            };
            var servico = CriarServico();

            // Act
            var (token, expiraEm) = servico.GerarToken(usuario);

            // Assert
            Assert.False(string.IsNullOrWhiteSpace(token));
            Assert.True(expiraEm > DateTime.UtcNow);

            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
            Assert.Equal(usuario.UsuarioId.ToString(), jwt.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sub).Value);
            Assert.Equal(usuario.Email, jwt.Claims.First(c => c.Type == JwtRegisteredClaimNames.Email).Value);
            Assert.Contains(jwt.Claims, c => c.Value == TipoUsuario.Veterinario);
        }
    }
}
