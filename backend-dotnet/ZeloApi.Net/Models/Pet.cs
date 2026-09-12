using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ZeloApi.Net.Models
{
    [Table("ZELO_PET")]
    public class Pet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("PET_ID")]
        public long PetId { get; set; }

        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Nome deve ter entre 1 e 100 caracteres")]
        [Column("NOME")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Espécie é obrigatória")]
        [StringLength(30)]
        [Column("ESPECIE")]
        public string Especie { get; set; } = string.Empty;

        [StringLength(80)]
        [Column("RACA")]
        public string? Raca { get; set; }

        [Column("SEXO")]
        public char? Sexo { get; set; }

        [Column("DATA_NASCIMENTO")]
        public DateTime? DataNascimento { get; set; }

        [Range(0.1, 200.0, ErrorMessage = "Peso deve ser positivo")]
        [Column("PESO_KG", TypeName = "NUMBER(6,2)")]
        public decimal? PesoKg { get; set; }

        [Column("CASTRADO")]
        public char? Castrado { get; set; }

        [Column("CRIADO_EM")]
        public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<PetTutor> PetTutores { get; set; } = new List<PetTutor>();
    }
}
