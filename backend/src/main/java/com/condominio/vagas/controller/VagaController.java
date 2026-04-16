package com.condominio.vagas.controller;

import com.condominio.vagas.model.Vaga;
import com.condominio.vagas.service.VagaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vagas")
@RequiredArgsConstructor
public class VagaController {

    private final VagaService vagaService;

    @GetMapping
    public List<Vaga> listar() {
        return vagaService.listarTodas();
    }

    @GetMapping("/{id}")
    public Vaga buscar(@PathVariable Long id) {
        return vagaService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Vaga criar(@Valid @RequestBody Vaga vaga) {
        return vagaService.salvar(vaga);
    }

    @PutMapping("/{id}")
    public Vaga atualizar(@PathVariable Long id, @Valid @RequestBody Vaga vaga) {
        return vagaService.atualizar(id, vaga);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        vagaService.excluir(id);
    }
}
