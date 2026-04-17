package com.condominio.vagas.repository;

import com.condominio.vagas.model.Morador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MoradorRepository extends JpaRepository<Morador, Long> {
    Optional<Morador> findByEmail(String email);
    Optional<Morador> findByGoogleId(String googleId);
}
