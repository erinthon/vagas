package com.condominio.vagas.repository;

import com.condominio.vagas.model.Cargo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CargoRepository extends JpaRepository<Cargo, Long> {
    List<Cargo> findByCondominioId(Long condominioId);
}
