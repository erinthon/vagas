package com.condominio.vagas.controller;

import com.condominio.vagas.dto.AdminLoginRequest;
import com.condominio.vagas.dto.AdminUserRequest;
import com.condominio.vagas.dto.TokenResponse;
import com.condominio.vagas.model.AdminUser;
import com.condominio.vagas.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminUserService adminUserService;

    @PostMapping("/auth/login")
    public TokenResponse login(@Valid @RequestBody AdminLoginRequest request) {
        return new TokenResponse(adminUserService.login(request));
    }

    @GetMapping("/usuarios")
    public List<AdminUser> listarUsuarios() {
        return adminUserService.listar();
    }

    @PostMapping("/usuarios")
    @ResponseStatus(HttpStatus.CREATED)
    public AdminUser criarUsuario(@Valid @RequestBody AdminUserRequest request) {
        return adminUserService.criar(request);
    }
}
