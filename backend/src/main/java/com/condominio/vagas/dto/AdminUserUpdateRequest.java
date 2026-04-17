package com.condominio.vagas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminUserUpdateRequest {

    @NotBlank
    private String nome;

    @Email
    @NotBlank
    private String email;

    private String senha;
}
