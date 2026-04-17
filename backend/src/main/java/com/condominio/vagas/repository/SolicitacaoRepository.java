package com.condominio.vagas.repository;

import com.condominio.vagas.model.Solicitacao;
import com.condominio.vagas.model.Solicitacao.StatusSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    List<Solicitacao> findByStatus(StatusSolicitacao status);
    List<Solicitacao> findByMoradorId(Long moradorId);
    boolean existsByMoradorIdAndStatus(Long moradorId, StatusSolicitacao status);
}
