package com.condominio.vagas.service;

import com.condominio.vagas.exception.RegraDeNegocioException;
import com.condominio.vagas.model.Morador;
import com.condominio.vagas.model.Oferta;
import com.condominio.vagas.model.Vaga;
import com.condominio.vagas.repository.OfertaRepository;
import com.condominio.vagas.repository.VagaRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VagaServiceTest {

    @Mock VagaRepository vagaRepository;
    @Mock OfertaRepository ofertaRepository;
    @InjectMocks VagaService vagaService;

    @AfterEach
    void limparContexto() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void salvar_naoAdmin_moradorJaPossuiVaga_lancaExcecao() {
        Morador morador = new Morador();
        morador.setId(1L);
        Vaga vaga = new Vaga();
        vaga.setProprietario(morador);

        when(vagaRepository.countByProprietarioId(1L)).thenReturn(1);

        assertThatThrownBy(() -> vagaService.salvar(vaga))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessageContaining("já possui uma vaga");
    }

    @Test
    void salvar_naoAdmin_moradorSemVaga_sucesso() {
        Morador morador = new Morador();
        morador.setId(1L);
        Vaga vaga = new Vaga();
        vaga.setProprietario(morador);

        when(vagaRepository.countByProprietarioId(1L)).thenReturn(0);
        when(vagaRepository.save(vaga)).thenReturn(vaga);

        Vaga resultado = vagaService.salvar(vaga);

        assertThat(resultado).isEqualTo(vaga);
    }

    @Test
    void salvar_admin_ultrapassaLimite_sucesso() {
        var auth = new UsernamePasswordAuthenticationToken(1L, null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        SecurityContextHolder.getContext().setAuthentication(auth);

        Morador morador = new Morador();
        morador.setId(1L);
        Vaga vaga = new Vaga();
        vaga.setProprietario(morador);

        when(vagaRepository.save(vaga)).thenReturn(vaga);

        Vaga resultado = vagaService.salvar(vaga);

        assertThat(resultado).isEqualTo(vaga);
        verify(vagaRepository, never()).countByProprietarioId(anyLong());
    }

    @Test
    void excluir_comOfertaAtiva_lancaExcecao() {
        when(ofertaRepository.existsByVagaIdAndStatus(1L, Oferta.StatusOferta.ATIVA)).thenReturn(true);

        assertThatThrownBy(() -> vagaService.excluir(1L))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessageContaining("ofertas ativas");
    }

    @Test
    void excluir_semOfertaAtiva_deletaVaga() {
        when(ofertaRepository.existsByVagaIdAndStatus(1L, Oferta.StatusOferta.ATIVA)).thenReturn(false);

        vagaService.excluir(1L);

        verify(vagaRepository).deleteById(1L);
    }

    @Test
    void listarPorMorador_delegaAoRepositorio() {
        Vaga vaga = new Vaga();
        when(vagaRepository.findByProprietarioId(1L)).thenReturn(List.of(vaga));

        List<Vaga> resultado = vagaService.listarPorMorador(1L);

        assertThat(resultado).hasSize(1);
    }
}
