package com.condominio.vagas.service;

import com.condominio.vagas.exception.RegraDeNegocioException;
import com.condominio.vagas.model.Condominio;
import com.condominio.vagas.model.Morador;
import com.condominio.vagas.model.Oferta;
import com.condominio.vagas.model.Oferta.StatusOferta;
import com.condominio.vagas.model.Vaga;
import com.condominio.vagas.repository.MoradorRepository;
import com.condominio.vagas.repository.OfertaRepository;
import com.condominio.vagas.repository.VagaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OfertaServiceTest {

    @Mock OfertaRepository ofertaRepository;
    @Mock MoradorRepository moradorRepository;
    @Mock VagaRepository vagaRepository;
    @InjectMocks OfertaService ofertaService;

    private Morador morador;
    private Vaga vaga;

    @BeforeEach
    void setup() {
        morador = new Morador();
        morador.setId(1L);
        Condominio cond = new Condominio();
        cond.setId(1L);
        morador.setCondominio(cond);

        vaga = new Vaga();
        vaga.setId(10L);
        vaga.setProprietario(morador);
    }

    private Oferta ofertaValida() {
        Oferta o = new Oferta();
        Morador m = new Morador(); m.setId(1L);
        Vaga v = new Vaga(); v.setId(10L);
        o.setMorador(m);
        o.setVaga(v);
        o.setDataInicio(LocalDate.now().plusDays(1));
        o.setDataFim(LocalDate.now().plusDays(10));
        return o;
    }

    @Test
    void salvar_moradorNaoProprietarioDaVaga_lancaExcecao() {
        Morador outro = new Morador(); outro.setId(99L);
        vaga.setProprietario(outro);

        when(moradorRepository.findById(1L)).thenReturn(Optional.of(morador));
        when(vagaRepository.findById(10L)).thenReturn(Optional.of(vaga));

        assertThatThrownBy(() -> ofertaService.salvar(ofertaValida()))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessageContaining("proprietário da vaga");
    }

    @Test
    void salvar_semCondominio_lancaExcecao() {
        morador.setCondominio(null);
        when(moradorRepository.findById(1L)).thenReturn(Optional.of(morador));
        when(vagaRepository.findById(10L)).thenReturn(Optional.of(vaga));

        assertThatThrownBy(() -> ofertaService.salvar(ofertaValida()))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessageContaining("condomínio");
    }

    @Test
    void salvar_dataInicioNoPassado_lancaExcecao() {
        Oferta o = ofertaValida();
        o.setDataInicio(LocalDate.now().minusDays(1));
        o.setDataFim(LocalDate.now().plusDays(5));

        when(moradorRepository.findById(1L)).thenReturn(Optional.of(morador));
        when(vagaRepository.findById(10L)).thenReturn(Optional.of(vaga));

        assertThatThrownBy(() -> ofertaService.salvar(o))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessageContaining("passado");
    }

    @Test
    void salvar_dataInicioIgualOuAposDataFim_lancaExcecao() {
        Oferta o = ofertaValida();
        o.setDataInicio(LocalDate.now().plusDays(5));
        o.setDataFim(LocalDate.now().plusDays(5));

        when(moradorRepository.findById(1L)).thenReturn(Optional.of(morador));
        when(vagaRepository.findById(10L)).thenReturn(Optional.of(vaga));

        assertThatThrownBy(() -> ofertaService.salvar(o))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessageContaining("anterior");
    }

    @Test
    void salvar_sobreposicaoDePeriodo_lancaExcecao() {
        Oferta o = ofertaValida();

        when(moradorRepository.findById(1L)).thenReturn(Optional.of(morador));
        when(vagaRepository.findById(10L)).thenReturn(Optional.of(vaga));
        when(ofertaRepository.existsByVagaIdAndStatusAndDataInicioLessThanEqualAndDataFimGreaterThanEqual(
                eq(10L), eq(StatusOferta.ATIVA), any(), any())).thenReturn(true);

        assertThatThrownBy(() -> ofertaService.salvar(o))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessageContaining("período informado");
    }

    @Test
    void salvar_dadosValidos_retornaOfertaSalva() {
        Oferta o = ofertaValida();
        when(moradorRepository.findById(1L)).thenReturn(Optional.of(morador));
        when(vagaRepository.findById(10L)).thenReturn(Optional.of(vaga));
        when(ofertaRepository.existsByVagaIdAndStatusAndDataInicioLessThanEqualAndDataFimGreaterThanEqual(
                any(), any(), any(), any())).thenReturn(false);
        when(ofertaRepository.save(o)).thenReturn(o);

        Oferta resultado = ofertaService.salvar(o);

        assertThat(resultado).isEqualTo(o);
    }

    @Test
    void encerrar_mudaStatusParaEncerrada() {
        Oferta o = new Oferta();
        o.setStatus(StatusOferta.ATIVA);
        when(ofertaRepository.findById(1L)).thenReturn(Optional.of(o));
        when(ofertaRepository.save(o)).thenReturn(o);

        Oferta resultado = ofertaService.encerrar(1L);

        assertThat(resultado.getStatus()).isEqualTo(StatusOferta.ENCERRADA);
    }
}
