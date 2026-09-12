package br.com.fiap.zelo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "cuidados")
public class Cuidado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "pet_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_cuidado_pet"))
    private Pet pet;

    @NotBlank @Size(max = 40)
    @Column(nullable = false, length = 40)
    private String tipo;

    @NotBlank @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String descricao;

    @NotNull
    @Column(name = "data_prevista", nullable = false)
    private LocalDate dataPrevista;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusCuidado status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Pet getPet() { return pet; }
    public void setPet(Pet pet) { this.pet = pet; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public LocalDate getDataPrevista() { return dataPrevista; }
    public void setDataPrevista(LocalDate dataPrevista) { this.dataPrevista = dataPrevista; }
    public StatusCuidado getStatus() { return status; }
    public void setStatus(StatusCuidado status) { this.status = status; }
}
