package com.condominio.vagas.service;

import com.condominio.vagas.exception.RegraDeNegocioException;
import com.condominio.vagas.model.Condominio;
import com.condominio.vagas.model.Morador;
import com.condominio.vagas.model.Oferta;
import com.condominio.vagas.model.Solicitacao;
import com.condominio.vagas.model.Solicitacao.StatusSolicitacao;
import com.condominio.vagas.repository.MoradorRepository;
import com.condominio.vagas.repository.SolicitacaoRepository;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SolicitacaoServiceTest {

    @Mock SolicitacaoRepository solicitacaoRepository;
    @Mock OfertaService ofertaService;
    @Mock MoradorRepository moradorRepository;
    @InjectMocks SolicitacaoService solicitacaoService;

    private Morador morador;

    @BeforeEach
    void setup() {
        morador = new Morador();
        morador.setId(1L);
        Condominio cond = new Condominio();
        cond.setId(1L);
        morador.setCondominio(cond);
    }

    private Solicitacao solicitacaoValida() {
        Solicitacao s = new Solicitacao();
        Morador m = new Morador(); m.setId(1L);
        s.setMorador(m);
        s.setDataInicio(LocalDate.now().plusDays(1));
        s.setDataFim(LocalDate.now().plusDays(5));
        return s;
    }

    @Test
    void salvar_moradorNaoEncontrado_lancaExcecao() {
        when(moradorRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> solicitacaoService.salvar(solicitacaoValida()))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessageContaining("Morador não encontrado");
    }

    @Test
    void salvar_semCondominio_lancaExcecao() {
        morador.setCondominio(null);
        when(moradorRepository.findById(1L)).thenReturn(Optional.of(morador));

        assertThatThrownBy(() -> solicitacaoService.salvar(solicitacaoValida()))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessageContaining("condomínio");
    }

    @Test
    void salvar_dataInicioIgualOuAposDataFim_lancaExcecao() {
        Solicitacao s = solicitacaoValida();
        s.setDataInicio(LocalDate.now().plusDays(5));
        s.setDataFim(LocalDate.now().plusDays(5));
        when(moradorRepository.findById(1L)).thenReturn(Optional.of(morador));

        assertThatThrownBy(() -> solicitacaoService.salvar(s))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessageContaining("anterior");
    }

    @Test
    void salvar_dataInicioNoPassado_lancaExcecao() {
        Solicitacao s = solicitacaoValida();
        s.setDataInicio(LocalDate.now().minusDays(1));
        when(moradorRepository.findById(1L)).thenReturn(Optional.of(morador));

        assertThatThrownBy(() -> solicitacaoService.salvar(s))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessageContaining("passado");
    }

    @Test
    void salvar_dadosValidos_retornaSolicitacaoSalva() {
        Solicitacao s = solicitacaoValida();
        when(moradorRepository.findById(1L)).thenReturn(Optional.of(morador));
        when(solicitacaoRepository.save(s)).thenReturn(s);

        Solicitacao resultado = solicitacaoService.salvar(s);

        assertThat(resultado).isEqualTo(s);
    }

    @Test
    void cancelar_solicitacaoNaoPendente_lancaExcecao() {
        Solicitacao s = new Solicitacao();
        s.setStatus(StatusSolicitacao.ATENDIDA);
        when(solicitacaoRepository.findById(1L)).thenReturn(Optional.of(s));

        assertThatThrownBy(() -> solicitacaoService.cancelar(1L))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessageContaining("pendentes");
    }

    @Test
    void cancelar_solicitacaoPendente_mudaStatusParaCancelada() {
        Solicitacao s = new Solicitacao();
        s.setStatus(StatusSolicitacao.PENDENTE);
        when(solicitacaoRepository.findById(1L)).thenReturn(Optional.of(s));
        when(solicitacaoRepository.save(s)).thenReturn(s);

        Solicitacao resultado = solicitacaoService.cancelar(1L);

        assertThat(resultado.getStatus()).isEqualTo(StatusSolicitacao.CANCELADA);
    }

    @Test
    void atender_periodoOfertaNaoCobreSolicitacao_lancaExcecao() {
        Solicitacao s = new Solicitacao();
        s.setDataInicio(LocalDate.now().plusDays(1));
        s.setDataFim(LocalDate.now().plusDays(10));
        s.setStatus(StatusSolicitacao.PENDENTE);

        Oferta o = new Oferta();
        o.setDataInicio(LocalDate.now().plusDays(3)); // começa depois
        o.setDataFim(LocalDate.now().plusDays(10));

        when(solicitacaoRepository.findById(1L)).thenReturn(Optional.of(s));
        when(ofertaService.buscarPorId(2L)).thenReturn(o);

        assertThatThrownBy(() -> solicitacaoService.atender(1L, 2L))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessageContaining("não cobre");
    }

    @Test
    void atender_periodoValido_marcaComoAtendidaEEncerraOferta() {
        Solicitacao s = new Solicitacao();
        s.setDataInicio(LocalDate.now().plusDays(2));
        s.setDataFim(LocalDate.now().plusDays(8));
        s.setStatus(StatusSolicitacao.PENDENTE);

        Oferta o = new Oferta();
        o.setDataInicio(LocalDate.now().plusDays(1)); // cobre início
        o.setDataFim(LocalDate.now().plusDays(10));   // cobre fim

        when(solicitacaoRepository.findById(1L)).thenReturn(Optional.of(s));
        when(ofertaService.buscarPorId(2L)).thenReturn(o);
        when(solicitacaoRepository.save(s)).thenReturn(s);

        Solicitacao resultado = solicitacaoService.atender(1L, 2L);

        assertThat(resultado.getStatus()).isEqualTo(StatusSolicitacao.ATENDIDA);
        assertThat(resultado.getOfertaAtendida()).isEqualTo(o);
    }
}
