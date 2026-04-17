package com.condominio.vagas.controller;

import com.condominio.vagas.model.*;
import com.condominio.vagas.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/painel")
@RequiredArgsConstructor
public class AdminPainelController {

    private final CondominioRepository condominioRepository;
    private final MoradorRepository moradorRepository;
    private final VagaRepository vagaRepository;
    private final CargoRepository cargoRepository;
    private final OfertaRepository ofertaRepository;
    private final SolicitacaoRepository solicitacaoRepository;

    @GetMapping("/condominios")
    public List<Condominio> condominios() {
        return condominioRepository.findAll();
    }

    @GetMapping("/condominios/{id}/moradores")
    public List<Morador> morадoresDoCondominio(@PathVariable Long id) {
        return moradorRepository.findByCondominioId(id);
    }

    @GetMapping("/moradores")
    public List<Morador> moradores() {
        return moradorRepository.findAll();
    }

    @GetMapping("/vagas")
    public List<Vaga> vagas() {
        return vagaRepository.findAll();
    }

    @GetMapping("/cargos")
    public List<Cargo> cargos() {
        return cargoRepository.findAll();
    }

    @GetMapping("/ofertas")
    public List<Oferta> ofertas() {
        return ofertaRepository.findAll();
    }

    @GetMapping("/solicitacoes")
    public List<Solicitacao> solicitacoes() {
        return solicitacaoRepository.findAll();
    }
}
