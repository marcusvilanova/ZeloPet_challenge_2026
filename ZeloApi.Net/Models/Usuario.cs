using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ZeloApi.Net.Models
{
    public static class TipoUsuario
    {
        public const string Tutor = "TUTOR";
        public const string Veterinario = "VETERINARIO";
        public const string Gestor = "GESTOR";
    }

    [Table("ZELO_USUARIO")]
    public class Usuario
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("USUARIO_ID")]
        public long UsuarioId { get; set; }

        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(120, MinimumLength = 3, ErrorMessage = "Nome deve ter entre 3 e 120 caracteres")]
        [Column("NOME")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        [StringLength(160)]
        [Column("EMAIL")]
        public string Email { get; set; } = string.Empty;

        [JsonIgnore]
        [Column("SENHA_HASH")]
        public string? SenhaHash { get; set; }

        [Required]
        [StringLength(20)]
        [Column("TIPO_USUARIO")]
        public string TipoUsuario { get; set; } = ZeloApi.Net.Models.TipoUsuario.Tutor;

        [Required]
        [Column("ATIVO")]
        public char Ativo { get; set; } = 'S';

        [Column("CRIADO_EM")]
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public Tutor? Tutor { get; set; }
    }
}
