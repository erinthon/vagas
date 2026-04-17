package com.condominio.vagas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CondominioRegistroRequest {

    @NotBlank
    private String nome;
    private String cnpj;
    private String endereco;
    private String telefone;
    @Email
    private String email;

    // Opção 1: vincular morador existente como síndico
    private Long moradorId;

    // Opção 2: criar novo morador síndico (usado quando moradorId é nulo)
    private String responsavelNome;
    @Email
    private String responsavelEmail;
    private String responsavelApartamento;
    private String responsavelBloco;
    private String responsavelTelefone;
}
