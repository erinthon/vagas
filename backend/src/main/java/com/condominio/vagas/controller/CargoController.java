package com.condominio.vagas.controller;

import com.condominio.vagas.model.Cargo;
import com.condominio.vagas.service.CargoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/condominios/{condominioId}/cargos")
@RequiredArgsConstructor
public class CargoController {

    private final CargoService service;

    @GetMapping
    public List<Cargo> listar(@PathVariable Long condominioId) {
        return service.listarPorCondominio(condominioId);
    }

    @PostMapping
    public Cargo criar(@PathVariable Long condominioId, @Valid @RequestBody Cargo cargo) {
        return service.salvar(condominioId, cargo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cargo> atualizar(@PathVariable Long condominioId,
                                           @PathVariable Long id,
                                           @Valid @RequestBody Cargo dados) {
        return service.atualizar(id, dados)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long condominioId, @PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
