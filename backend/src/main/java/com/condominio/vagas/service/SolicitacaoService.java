package com.condominio.vagas.service;

import com.condominio.vagas.model.Oferta;
import com.condominio.vagas.model.Solicitacao;
import com.condominio.vagas.model.Solicitacao.StatusSolicitacao;
import com.condominio.vagas.repository.SolicitacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final OfertaService ofertaService;

    public List<Solicitacao> listarPendentes() {
        return solicitacaoRepository.findByStatus(StatusSolicitacao.PENDENTE);
    }

    public List<Solicitacao> listarPorMorador(Long moradorId) {
        return solicitacaoRepository.findByMoradorId(moradorId);
    }

    public Solicitacao buscarPorId(Long id) {
        return solicitacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada: " + id));
    }

    public Solicitacao salvar(Solicitacao solicitacao) {
        return solicitacaoRepository.save(solicitacao);
    }

    public Solicitacao atender(Long solicitacaoId, Long ofertaId) {
        Solicitacao solicitacao = buscarPorId(solicitacaoId);
        Oferta oferta = ofertaService.buscarPorId(ofertaId);
        solicitacao.setStatus(StatusSolicitacao.ATENDIDA);
        solicitacao.setOfertaAtendida(oferta);
        ofertaService.encerrar(ofertaId);
        return solicitacaoRepository.save(solicitacao);
    }

    public Solicitacao cancelar(Long id) {
        Solicitacao solicitacao = buscarPorId(id);
        solicitacao.setStatus(StatusSolicitacao.CANCELADA);
        return solicitacaoRepository.save(solicitacao);
    }
}
