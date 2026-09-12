using System.ComponentModel.DataAnnotations;

namespace ZeloApi.Net.Dtos
{
    public class TutorCreateDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(120, MinimumLength = 3, ErrorMessage = "Nome deve ter entre 3 e 120 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Senha é obrigatória")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Senha deve ter no mínimo 6 caracteres")]
        public string Senha { get; set; } = string.Empty;

        public string? Telefone { get; set; }

        public string? Cidade { get; set; }

        [StringLength(2, MinimumLength = 2, ErrorMessage = "Estado deve ter 2 caracteres (UF)")]
        public string? Estado { get; set; }
    }

    public class TutorUpdateDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(120, MinimumLength = 3, ErrorMessage = "Nome deve ter entre 3 e 120 caracteres")]
        public string Nome { get; set; } = string.Empty;

        public string? Telefone { get; set; }

        public string? Cidade { get; set; }

        [StringLength(2, MinimumLength = 2, ErrorMessage = "Estado deve ter 2 caracteres (UF)")]
        public string? Estado { get; set; }
    }

    public class TutorResponseDto
    {
        public long TutorId { get; set; }
        public long UsuarioId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Telefone { get; set; }
        public string? Cidade { get; set; }
        public string? Estado { get; set; }
        public DateTime CriadoEm { get; set; }
        public List<long> PetIds { get; set; } = new();
    }
}
