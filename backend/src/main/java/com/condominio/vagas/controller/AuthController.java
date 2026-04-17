package com.condominio.vagas.controller;

import com.condominio.vagas.model.Morador;
import com.condominio.vagas.repository.MoradorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final MoradorRepository moradorRepository;

    @GetMapping("/me")
    public ResponseEntity<Morador> me(Authentication authentication) {
        Long moradorId = (Long) authentication.getPrincipal();
        return moradorRepository.findById(moradorId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<Morador> updateProfile(@RequestBody Morador dados, Authentication authentication) {
        Long moradorId = (Long) authentication.getPrincipal();
        return moradorRepository.findById(moradorId).map(morador -> {
            if (dados.getApartamento() != null) morador.setApartamento(dados.getApartamento());
            if (dados.getBloco() != null) morador.setBloco(dados.getBloco());
            if (dados.getTelefone() != null) morador.setTelefone(dados.getTelefone());
            return ResponseEntity.ok(moradorRepository.save(morador));
        }).orElse(ResponseEntity.notFound().build());
    }
}
