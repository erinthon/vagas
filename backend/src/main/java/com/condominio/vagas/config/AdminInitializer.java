package com.condominio.vagas.config;

import com.condominio.vagas.model.AdminUser;
import com.condominio.vagas.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.bootstrap.username:}")
    private String bootstrapUsername;

    @Value("${admin.bootstrap.password:}")
    private String bootstrapPassword;

    @Value("${admin.bootstrap.email:}")
    private String bootstrapEmail;

    @Override
    public void run(String... args) {
        if (bootstrapUsername.isBlank() || bootstrapPassword.isBlank()) {
            return;
        }
        // Cria o primeiro admin apenas se nenhum existir
        if (adminUserRepository.count() == 0) {
            AdminUser admin = new AdminUser();
            admin.setUsername(bootstrapUsername);
            admin.setNome(bootstrapUsername);
            admin.setEmail(bootstrapEmail.isBlank() ? bootstrapUsername + "@admin.local" : bootstrapEmail);
            admin.setSenha(passwordEncoder.encode(bootstrapPassword));
            adminUserRepository.save(admin);
        }
    }
}
