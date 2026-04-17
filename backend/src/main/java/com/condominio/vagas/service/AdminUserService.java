package com.condominio.vagas.service;

import com.condominio.vagas.dto.AdminLoginRequest;
import com.condominio.vagas.dto.AdminUserRequest;
import com.condominio.vagas.exception.RegraDeNegocioException;
import com.condominio.vagas.model.AdminUser;
import com.condominio.vagas.repository.AdminUserRepository;
import com.condominio.vagas.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public String login(AdminLoginRequest request) {
        AdminUser admin = adminUserRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RegraDeNegocioException("Credenciais inválidas."));

        if (!passwordEncoder.matches(request.getSenha(), admin.getSenha())) {
            throw new RegraDeNegocioException("Credenciais inválidas.");
        }

        return jwtService.generateToken(admin.getId(), admin.getEmail(), admin.getNome(), "ADMIN");
    }

    public AdminUser criar(AdminUserRequest request) {
        if (adminUserRepository.existsByUsername(request.getUsername())) {
            throw new RegraDeNegocioException("Username já está em uso.");
        }

        AdminUser admin = new AdminUser();
        admin.setUsername(request.getUsername());
        admin.setNome(request.getNome());
        admin.setEmail(request.getEmail());
        admin.setSenha(passwordEncoder.encode(request.getSenha()));
        return adminUserRepository.save(admin);
    }

    public List<AdminUser> listar() {
        return adminUserRepository.findAll();
    }
}
