package com.condominio.vagas.repository;

import com.condominio.vagas.model.Oferta;
import com.condominio.vagas.model.Oferta.StatusOferta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface OfertaRepository extends JpaRepository<Oferta, Long> {
    List<Oferta> findByStatus(StatusOferta status);
    List<Oferta> findByMoradorId(Long moradorId);
    List<Oferta> findByStatusAndDataInicioLessThanEqualAndDataFimGreaterThanEqual(
            StatusOferta status, LocalDate dataFim, LocalDate dataInicio);
}
