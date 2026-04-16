package com.condominio.vagas.service;

import com.condominio.vagas.model.Oferta;
import com.condominio.vagas.model.Oferta.StatusOferta;
import com.condominio.vagas.repository.OfertaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfertaService {

    private final OfertaRepository ofertaRepository;

    public List<Oferta> listarAtivas() {
        return ofertaRepository.findByStatus(StatusOferta.ATIVA);
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
        return ofertaRepository.save(oferta);
    }

    public Oferta encerrar(Long id) {
        Oferta oferta = buscarPorId(id);
        oferta.setStatus(StatusOferta.ENCERRADA);
        return ofertaRepository.save(oferta);
    }
}
