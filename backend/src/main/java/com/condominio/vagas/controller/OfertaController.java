package com.condominio.vagas.controller;

import com.condominio.vagas.model.Morador;
import com.condominio.vagas.model.Oferta;
import com.condominio.vagas.service.OfertaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ofertas")
@RequiredArgsConstructor
public class OfertaController {

    private final OfertaService ofertaService;

    @GetMapping("/minhas")
    public List<Oferta> listarMinhas(Authentication authentication) {
        Long moradorId = (Long) authentication.getPrincipal();
        return ofertaService.listarPorMorador(moradorId);
    }

    @PostMapping("/minhas")
    @ResponseStatus(HttpStatus.CREATED)
    public Oferta criarMinha(@Valid @RequestBody Oferta oferta, Authentication authentication) {
        Long moradorId = (Long) authentication.getPrincipal();
        Morador morador = new Morador();
        morador.setId(moradorId);
        oferta.setMorador(morador);
        return ofertaService.salvar(oferta);
    }

    @GetMapping
    public List<Oferta> listar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        if (dataInicio != null && dataFim != null) {
            return ofertaService.listarDisponiveisNoPeriodo(dataInicio, dataFim);
        }
        return ofertaService.listarAtivas();
    }

    @GetMapping("/{id}")
    public Oferta buscar(@PathVariable Long id) {
        return ofertaService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Oferta criar(@Valid @RequestBody Oferta oferta) {
        return ofertaService.salvar(oferta);
    }

    @PatchMapping("/{id}/encerrar")
    public Oferta encerrar(@PathVariable Long id) {
        return ofertaService.encerrar(id);
    }
}
