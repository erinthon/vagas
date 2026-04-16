package com.condominio.vagas.repository;

import com.condominio.vagas.model.Vaga;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VagaRepository extends JpaRepository<Vaga, Long> {
    List<Vaga> findByProprietarioId(Long moradorId);
}
