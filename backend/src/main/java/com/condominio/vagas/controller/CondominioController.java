package com.condominio.vagas.controller;

import com.condominio.vagas.model.Condominio;
import com.condominio.vagas.service.CondominioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/condominios")
@RequiredArgsConstructor
public class CondominioController {

    private final CondominioService service;

    @GetMapping
    public List<Condominio> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Condominio> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Condominio criar(@Valid @RequestBody Condominio condominio) {
        return service.salvar(condominio);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Condominio> atualizar(@PathVariable Long id, @Valid @RequestBody Condominio dados) {
        return service.atualizar(id, dados)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
