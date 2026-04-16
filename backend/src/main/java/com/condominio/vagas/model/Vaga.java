package com.condominio.vagas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vagas")
@Data
@NoArgsConstructor
public class Vaga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(unique = true)
    private Integer numero;

    @Enumerated(EnumType.STRING)
    private TipoVaga tipo = TipoVaga.DESCOBERTA;

    @ManyToOne
    @JoinColumn(name = "proprietario_id")
    private Morador proprietario;

    public enum TipoVaga {
        COBERTA, DESCOBERTA
    }
}
