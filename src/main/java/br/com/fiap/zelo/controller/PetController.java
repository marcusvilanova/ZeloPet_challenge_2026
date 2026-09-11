package br.com.fiap.zelo.controller;

import br.com.fiap.zelo.exception.RecursoNaoEncontradoException;
import br.com.fiap.zelo.model.Pet;
import br.com.fiap.zelo.repository.PetRepository;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {
    private final PetRepository repository;
    public PetController(PetRepository repository) { this.repository = repository; }

    @GetMapping
    public List<Pet> listar() { return repository.findAll(); }

    @GetMapping("/{id}")
    public Pet buscar(@PathVariable Long id) { return encontrar(id); }

    @PostMapping
    public ResponseEntity<Pet> criar(@Valid @RequestBody Pet pet) {
        pet.setId(null);
        Pet salvo = repository.save(pet);
        return ResponseEntity.created(URI.create("/api/pets/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public Pet atualizar(@PathVariable Long id, @Valid @RequestBody Pet dados) {
        Pet pet = encontrar(id);
        pet.setNome(dados.getNome()); pet.setEspecie(dados.getEspecie());
        pet.setRaca(dados.getRaca()); pet.setDataNascimento(dados.getDataNascimento());
        pet.setNomeTutor(dados.getNomeTutor());
        return repository.save(pet);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        repository.delete(encontrar(id));
        return ResponseEntity.noContent().build();
    }

    private Pet encontrar(Long id) {
        return repository.findById(id).orElseThrow(() ->
                new RecursoNaoEncontradoException("Pet nao encontrado: " + id));
    }
}
