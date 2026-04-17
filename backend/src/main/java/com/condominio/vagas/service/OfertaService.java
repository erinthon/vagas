package com.condominio.vagas.service;

import com.condominio.vagas.exception.RegraDeNegocioException;
import com.condominio.vagas.model.Morador;
import com.condominio.vagas.model.Oferta;
import com.condominio.vagas.model.Oferta.StatusOferta;
import com.condominio.vagas.model.Vaga;
import com.condominio.vagas.repository.MoradorRepository;
import com.condominio.vagas.repository.OfertaRepository;
import com.condominio.vagas.repository.VagaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfertaService {

    private final OfertaRepository ofertaRepository;
    private final MoradorRepository moradorRepository;
    private final VagaRepository vagaRepository;

    public List<Oferta> listarAtivas() {
        return ofertaRepository.findByStatus(StatusOferta.ATIVA);
    }

    public List<Oferta> listarPorMorador(Long moradorId) {
        return ofertaRepository.findByMoradorId(moradorId);
    }

    public List<Oferta> listarDisponiveisNoPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        return ofertaRepository.findByStatusAndDataInicioLessThanEqualAndDataFimGreaterThanEqual(
                StatusOferta.ATIVA, dataFim, dataInicio);
    }

    public Oferta buscarPorId(Long id) {
        return ofertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Oferta não encontrada: " + id));
    }

    public Oferta salvar(Oferta oferta) {
        // Carrega entidades completas para garantir acesso às associações
        Morador morador = moradorRepository.findById(oferta.getMorador().getId())
                .orElseThrow(() -> new RegraDeNegocioException("Morador não encontrado."));
        Vaga vaga = vagaRepository.findById(oferta.getVaga().getId())
                .orElseThrow(() -> new RegraDeNegocioException("Vaga não encontrada."));
        oferta.setMorador(morador);
        oferta.setVaga(vaga);

        // Regra 7: morador precisa estar vinculado a um condomínio
        if (morador.getCondominio() == null) {
            throw new RegraDeNegocioException("Morador não está vinculado a nenhum condomínio.");
        }

        // Regra 1: apenas o proprietário da vaga pode criar oferta
        Morador proprietario = vaga.getProprietario();
        if (proprietario == null || !proprietario.getId().equals(morador.getId())) {
            throw new RegraDeNegocioException("Apenas o proprietário da vaga pode criar uma oferta.");
        }

        // Regra 3: datas válidas
        if (!oferta.getDataInicio().isBefore(oferta.getDataFim())) {
            throw new RegraDeNegocioException("A data de início deve ser anterior à data de fim.");
        }
        if (oferta.getDataInicio().isBefore(LocalDate.now())) {
            throw new RegraDeNegocioException("A data de início não pode ser no passado.");
        }

        // Regra 2: sem sobreposição de períodos para a mesma vaga
        boolean overlap = ofertaRepository
                .existsByVagaIdAndStatusAndDataInicioLessThanEqualAndDataFimGreaterThanEqual(
                        vaga.getId(), StatusOferta.ATIVA,
                        oferta.getDataFim(), oferta.getDataInicio());
        if (overlap) {
            throw new RegraDeNegocioException(
                    "Já existe uma oferta ativa para esta vaga no período informado.");
        }

        return ofertaRepository.save(oferta);
    }

    public Oferta encerrar(Long id) {
        Oferta oferta = buscarPorId(id);
        oferta.setStatus(StatusOferta.ENCERRADA);
        return ofertaRepository.save(oferta);
    }
}
