package br.com.fiap.zelo.repository;

import br.com.fiap.zelo.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetRepository extends JpaRepository<Pet, Long> {}
