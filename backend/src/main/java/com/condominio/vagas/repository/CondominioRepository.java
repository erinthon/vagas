package com.condominio.vagas.repository;

import com.condominio.vagas.model.Condominio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CondominioRepository extends JpaRepository<Condominio, Long> {
    Optional<Condominio> findByCnpj(String cnpj);
}
