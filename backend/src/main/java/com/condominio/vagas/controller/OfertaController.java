package com.condominio.vagas.controller;

import com.condominio.vagas.model.Oferta;
import com.condominio.vagas.service.OfertaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ofertas")
@RequiredArgsConstructor
public class OfertaController {

    private final OfertaService ofertaService;

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
