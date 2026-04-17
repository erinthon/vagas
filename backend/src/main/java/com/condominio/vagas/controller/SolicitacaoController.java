package com.condominio.vagas.controller;

import com.condominio.vagas.model.Morador;
import com.condominio.vagas.model.Solicitacao;
import com.condominio.vagas.service.SolicitacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
@RequiredArgsConstructor
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    @GetMapping("/minhas")
    public List<Solicitacao> listarMinhas(Authentication authentication) {
        Long moradorId = (Long) authentication.getPrincipal();
        return solicitacaoService.listarPorMorador(moradorId);
    }

    @PostMapping("/minhas")
    @ResponseStatus(HttpStatus.CREATED)
    public Solicitacao criarMinha(@Valid @RequestBody Solicitacao solicitacao, Authentication authentication) {
        Long moradorId = (Long) authentication.getPrincipal();
        Morador morador = new Morador();
        morador.setId(moradorId);
        solicitacao.setMorador(morador);
        return solicitacaoService.salvar(solicitacao);
    }

    @GetMapping
    public List<Solicitacao> listarPendentes() {
        return solicitacaoService.listarPendentes();
    }

    @GetMapping("/morador/{moradorId}")
    public List<Solicitacao> listarPorMorador(@PathVariable Long moradorId) {
        return solicitacaoService.listarPorMorador(moradorId);
    }

    @GetMapping("/{id}")
    public Solicitacao buscar(@PathVariable Long id) {
        return solicitacaoService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Solicitacao criar(@Valid @RequestBody Solicitacao solicitacao) {
        return solicitacaoService.salvar(solicitacao);
    }

    @PatchMapping("/{id}/atender")
    public Solicitacao atender(@PathVariable Long id, @RequestParam Long ofertaId) {
        return solicitacaoService.atender(id, ofertaId);
    }

    @PatchMapping("/{id}/cancelar")
    public Solicitacao cancelar(@PathVariable Long id) {
        return solicitacaoService.cancelar(id);
    }
}
