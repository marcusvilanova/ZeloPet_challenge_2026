package br.com.fiap.zelo.controller;

import br.com.fiap.zelo.dto.CuidadoRequest;
import br.com.fiap.zelo.exception.RecursoNaoEncontradoException;
import br.com.fiap.zelo.model.*;
import br.com.fiap.zelo.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/cuidados")
public class CuidadoController {
    private final CuidadoRepository repository;
    private final PetRepository petRepository;
    public CuidadoController(CuidadoRepository repository, PetRepository petRepository) {
        this.repository = repository; this.petRepository = petRepository;
    }

    @GetMapping
    public List<Cuidado> listar(@RequestParam(required = false) Long petId) {
        return petId == null ? repository.findAll() : repository.findByPetId(petId);
    }

    @GetMapping("/{id}")
    public Cuidado buscar(@PathVariable Long id) { return encontrar(id); }

    @PostMapping
    public ResponseEntity<Cuidado> criar(@Valid @RequestBody CuidadoRequest dados) {
        Cuidado cuidado = preencher(new Cuidado(), dados);
        Cuidado salvo = repository.save(cuidado);
        return ResponseEntity.created(URI.create("/api/cuidados/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public Cuidado atualizar(@PathVariable Long id, @Valid @RequestBody CuidadoRequest dados) {
        return repository.save(preencher(encontrar(id), dados));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        repository.delete(encontrar(id));
        return ResponseEntity.noContent().build();
    }

    private Cuidado preencher(Cuidado cuidado, CuidadoRequest dados) {
        Pet pet = petRepository.findById(dados.petId()).orElseThrow(() ->
                new RecursoNaoEncontradoException("Pet nao encontrado: " + dados.petId()));
        cuidado.setPet(pet); cuidado.setTipo(dados.tipo());
        cuidado.setDescricao(dados.descricao()); cuidado.setDataPrevista(dados.dataPrevista());
        cuidado.setStatus(dados.status()); return cuidado;
    }

    private Cuidado encontrar(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new RecursoNaoEncontradoException("Cuidado nao encontrado: " + id));
    }
}
