package com.condominio.vagas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "ofertas")
@Data
@NoArgsConstructor
public class Oferta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "morador_id")
    @NotNull
    private Morador morador;

    @ManyToOne
    @JoinColumn(name = "vaga_id")
    @NotNull
    private Vaga vaga;

    @NotNull
    private LocalDate dataInicio;

    @NotNull
    private LocalDate dataFim;

    private String observacao;

    @Enumerated(EnumType.STRING)
    private StatusOferta status = StatusOferta.ATIVA;

    public enum StatusOferta {
        ATIVA, ENCERRADA
    }
}
