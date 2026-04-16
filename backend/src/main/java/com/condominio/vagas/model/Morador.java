package com.condominio.vagas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "moradores")
@Data
@NoArgsConstructor
public class Morador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nome;

    private String apartamento;

    private String bloco;

    @Email
    @NotBlank
    @Column(unique = true)
    private String email;

    private String telefone;

    @Column(unique = true)
    private String googleId;

    private String fotoPerfil;
}
