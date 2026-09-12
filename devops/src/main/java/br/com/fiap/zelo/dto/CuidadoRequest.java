package br.com.fiap.zelo.dto;

import br.com.fiap.zelo.model.StatusCuidado;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record CuidadoRequest(
        @NotNull Long petId,
        @NotBlank @Size(max = 40) String tipo,
        @NotBlank @Size(max = 255) String descricao,
        @NotNull LocalDate dataPrevista,
        @NotNull StatusCuidado status
) {}
