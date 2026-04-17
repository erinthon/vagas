package com.condominio.vagas.service;

import com.condominio.vagas.dto.VincularCondominioRequest;
import com.condominio.vagas.exception.RegraDeNegocioException;
import com.condominio.vagas.model.Condominio;
import com.condominio.vagas.model.Morador;
import com.condominio.vagas.model.Oferta;
import com.condominio.vagas.model.Solicitacao;
import com.condominio.vagas.repository.CondominioRepository;
import com.condominio.vagas.repository.MoradorRepository;
import com.condominio.vagas.repository.OfertaRepository;
import com.condominio.vagas.repository.SolicitacaoRepository;
import com.condominio.vagas.repository.VagaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MoradorService {

    private final MoradorRepository moradorRepository;
    private final VagaRepository vagaRepository;
    private final OfertaRepository ofertaRepository;
    private final SolicitacaoRepository solicitacaoRepository;
    private final CondominioRepository condominioRepository;

    public List<Morador> listarTodos() {
        return moradorRepository.findAll();
    }

    public Morador buscarPorId(Long id) {
        return moradorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Morador não encontrado: " + id));
    }

    public Morador salvar(Morador morador) {
        if (morador.getCondominio() == null) {
            throw new RegraDeNegocioException("Morador deve estar vinculado a um condomínio.");
        }
        return moradorRepository.save(morador);
    }

    public Morador atualizar(Long id, Morador dados) {
        Morador morador = buscarPorId(id);
        morador.setNome(dados.getNome());
        morador.setApartamento(dados.getApartamento());
        morador.setBloco(dados.getBloco());
        morador.setEmail(dados.getEmail());
        morador.setTelefone(dados.getTelefone());
        return moradorRepository.save(morador);
    }

    public Morador vincularCondominio(Long id, VincularCondominioRequest request) {
        Morador morador = buscarPorId(id);
        if (morador.getCondominio() != null) {
            throw new RegraDeNegocioException("Morador já está vinculado a um condomínio.");
        }
        Condominio condominio = condominioRepository.findById(request.getCondominioId())
                .orElseThrow(() -> new RegraDeNegocioException("Condomínio não encontrado."));
        morador.setCondominio(condominio);
        if (request.getApartamento() != null) morador.setApartamento(request.getApartamento());
        if (request.getBloco() != null) morador.setBloco(request.getBloco());
        return moradorRepository.save(morador);
    }

    public void excluir(Long id) {
        if (vagaRepository.existsByProprietarioId(id)) {
            throw new RegraDeNegocioException("Não é possível excluir um morador que possui vagas.");
        }
        if (ofertaRepository.existsByMoradorIdAndStatus(id, Oferta.StatusOferta.ATIVA)) {
            throw new RegraDeNegocioException("Não é possível excluir um morador com ofertas ativas.");
        }
        if (solicitacaoRepository.existsByMoradorIdAndStatus(id, Solicitacao.StatusSolicitacao.PENDENTE)) {
            throw new RegraDeNegocioException("Não é possível excluir um morador com solicitações pendentes.");
        }
        moradorRepository.deleteById(id);
    }
}
