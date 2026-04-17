package com.condominio.vagas.service;

import com.condominio.vagas.exception.RegraDeNegocioException;
import com.condominio.vagas.model.Oferta;
import com.condominio.vagas.model.Vaga;
import com.condominio.vagas.repository.OfertaRepository;
import com.condominio.vagas.repository.VagaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VagaService {

    private final VagaRepository vagaRepository;
    private final OfertaRepository ofertaRepository;

    public List<Vaga> listarTodas() {
        return vagaRepository.findAll();
    }

    public Vaga buscarPorId(Long id) {
        return vagaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada: " + id));
    }

    public Vaga salvar(Vaga vaga) {
        // Limite de 1 vaga por proprietário (liberação de vagas adicionais é administrativa)
        if (vaga.getProprietario() != null &&
            vagaRepository.countByProprietarioId(vaga.getProprietario().getId()) >= 1) {
            throw new RegraDeNegocioException(
                    "Morador já possui uma vaga. A liberação de vagas adicionais deve ser feita pelo administrador.");
        }
        return vagaRepository.save(vaga);
    }

    public Vaga atualizar(Long id, Vaga dados) {
        Vaga vaga = buscarPorId(id);
        vaga.setNumero(dados.getNumero());
        vaga.setTipo(dados.getTipo());
        vaga.setProprietario(dados.getProprietario());
        return vagaRepository.save(vaga);
    }

    public void excluir(Long id) {
        // Regra 8: não excluir vaga com ofertas ativas
        if (ofertaRepository.existsByVagaIdAndStatus(id, Oferta.StatusOferta.ATIVA)) {
            throw new RegraDeNegocioException("Não é possível excluir uma vaga com ofertas ativas.");
        }
        vagaRepository.deleteById(id);
    }
}
