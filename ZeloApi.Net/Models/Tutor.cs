using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ZeloApi.Net.Models
{
    [Table("ZELO_TUTOR")]
    public class Tutor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("TUTOR_ID")]
        public long TutorId { get; set; }

        [Required]
        [Column("USUARIO_ID")]
        public long UsuarioId { get; set; }

        [ForeignKey(nameof(UsuarioId))]
        public Usuario? Usuario { get; set; }

        [StringLength(25)]
        [Column("TELEFONE")]
        public string? Telefone { get; set; }

        [StringLength(80)]
        [Column("CIDADE")]
        public string? Cidade { get; set; }

        [StringLength(2)]
        [Column("ESTADO")]
        public string? Estado { get; set; }

        [Column("CRIADO_EM")]
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<PetTutor> PetTutores { get; set; } = new List<PetTutor>();
    }
}
