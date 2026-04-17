package com.condominio.vagas.service;

import com.condominio.vagas.exception.RegraDeNegocioException;
import com.condominio.vagas.model.Morador;
import com.condominio.vagas.model.Oferta;
import com.condominio.vagas.model.Solicitacao;
import com.condominio.vagas.model.Solicitacao.StatusSolicitacao;
import com.condominio.vagas.repository.MoradorRepository;
import com.condominio.vagas.repository.SolicitacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final OfertaService ofertaService;
    private final MoradorRepository moradorRepository;

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
        // Carrega morador completo para acessar condomínio
        Morador morador = moradorRepository.findById(solicitacao.getMorador().getId())
                .orElseThrow(() -> new RegraDeNegocioException("Morador não encontrado."));
        solicitacao.setMorador(morador);

        // Regra 7: morador precisa estar vinculado a um condomínio
        if (morador.getCondominio() == null) {
            throw new RegraDeNegocioException("Morador não está vinculado a nenhum condomínio.");
        }

        // Regra 3: datas válidas
        if (!solicitacao.getDataInicio().isBefore(solicitacao.getDataFim())) {
            throw new RegraDeNegocioException("A data de início deve ser anterior à data de fim.");
        }
        if (solicitacao.getDataInicio().isBefore(LocalDate.now())) {
            throw new RegraDeNegocioException("A data de início não pode ser no passado.");
        }

        return solicitacaoRepository.save(solicitacao);
    }

    public Solicitacao atender(Long solicitacaoId, Long ofertaId) {
        Solicitacao solicitacao = buscarPorId(solicitacaoId);
        Oferta oferta = ofertaService.buscarPorId(ofertaId);

        // Regra 4: período da oferta deve cobrir o período da solicitação
        if (oferta.getDataInicio().isAfter(solicitacao.getDataInicio()) ||
            oferta.getDataFim().isBefore(solicitacao.getDataFim())) {
            throw new RegraDeNegocioException(
                    "O período da oferta não cobre o período da solicitação.");
        }

        solicitacao.setStatus(StatusSolicitacao.ATENDIDA);
        solicitacao.setOfertaAtendida(oferta);
        ofertaService.encerrar(ofertaId);
        return solicitacaoRepository.save(solicitacao);
    }

    public Solicitacao cancelar(Long id) {
        Solicitacao solicitacao = buscarPorId(id);

        // Regra 5: apenas solicitações pendentes podem ser canceladas
        if (solicitacao.getStatus() != StatusSolicitacao.PENDENTE) {
            throw new RegraDeNegocioException("Apenas solicitações pendentes podem ser canceladas.");
        }

        solicitacao.setStatus(StatusSolicitacao.CANCELADA);
        return solicitacaoRepository.save(solicitacao);
    }
}
