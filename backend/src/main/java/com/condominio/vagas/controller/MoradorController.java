package com.condominio.vagas.controller;

import com.condominio.vagas.dto.VincularCondominioRequest;
import com.condominio.vagas.model.Morador;
import com.condominio.vagas.service.MoradorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moradores")
@RequiredArgsConstructor
public class MoradorController {

    private final MoradorService moradorService;

    @GetMapping
    public List<Morador> listar() {
        return moradorService.listarTodos();
    }

    @GetMapping("/{id}")
    public Morador buscar(@PathVariable Long id) {
        return moradorService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Morador criar(@Valid @RequestBody Morador morador) {
        return moradorService.salvar(morador);
    }

    @PutMapping("/{id}")
    public Morador atualizar(@PathVariable Long id, @Valid @RequestBody Morador morador) {
        return moradorService.atualizar(id, morador);
    }

    @PatchMapping("/{id}/condominio")
    public Morador vincularCondominio(@PathVariable Long id,
                                      @Valid @RequestBody VincularCondominioRequest request) {
        return moradorService.vincularCondominio(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        moradorService.excluir(id);
    }
}
