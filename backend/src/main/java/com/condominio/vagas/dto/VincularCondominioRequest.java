package com.condominio.vagas.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VincularCondominioRequest {

    @NotNull
    private Long condominioId;
    private String apartamento;
    private String bloco;
}
