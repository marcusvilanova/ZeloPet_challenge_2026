using System.ComponentModel.DataAnnotations;

namespace ZeloApi.Net.Dtos
{
    public class PetCreateDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Nome deve ter entre 1 e 100 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Espécie é obrigatória")]
        [StringLength(30)]
        public string Especie { get; set; } = string.Empty;

        public string? Raca { get; set; }

        public char? Sexo { get; set; }

        public DateTime? DataNascimento { get; set; }

        [Range(0.1, 200.0, ErrorMessage = "Peso deve ser positivo")]
        public decimal? PesoKg { get; set; }

        public char? Castrado { get; set; }

        [Required(ErrorMessage = "TutorId é obrigatório")]
        public long TutorId { get; set; }
    }

    public class PetUpdateDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Nome deve ter entre 1 e 100 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Espécie é obrigatória")]
        [StringLength(30)]
        public string Especie { get; set; } = string.Empty;

        public string? Raca { get; set; }

        public char? Sexo { get; set; }

        public DateTime? DataNascimento { get; set; }

        [Range(0.1, 200.0, ErrorMessage = "Peso deve ser positivo")]
        public decimal? PesoKg { get; set; }

        public char? Castrado { get; set; }
    }

    public class PetResponseDto
    {
        public long PetId { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Especie { get; set; } = string.Empty;
        public string? Raca { get; set; }
        public char? Sexo { get; set; }
        public DateTime? DataNascimento { get; set; }
        public decimal? PesoKg { get; set; }
        public char? Castrado { get; set; }
        public DateTime CriadoEm { get; set; }
        public List<long> TutorIds { get; set; } = new();
    }
}
