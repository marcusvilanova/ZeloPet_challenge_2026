using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ZeloApi.Net.Models
{
    [Table("ZELO_PET_TUTOR")]
    public class PetTutor
    {
        [Column("PET_ID")]
        public long PetId { get; set; }

        [ForeignKey(nameof(PetId))]
        [JsonIgnore]
        public Pet? Pet { get; set; }

        [Column("TUTOR_ID")]
        public long TutorId { get; set; }

        [ForeignKey(nameof(TutorId))]
        public Tutor? Tutor { get; set; }

        [Column("RESPONSAVEL_PRINCIPAL")]
        public char ResponsavelPrincipal { get; set; } = 'S';

        [Column("DATA_VINCULO")]
        public DateTime DataVinculo { get; set; } = DateTime.UtcNow;
    }
}
