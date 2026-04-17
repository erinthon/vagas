package com.condominio.vagas.controller;

import com.condominio.vagas.model.Morador;
import com.condominio.vagas.model.Solicitacao;
import com.condominio.vagas.model.Solicitacao.StatusSolicitacao;
import com.condominio.vagas.repository.AdminUserRepository;
import com.condominio.vagas.repository.MoradorRepository;
import com.condominio.vagas.security.JwtService;
import com.condominio.vagas.security.OAuth2LoginSuccessHandler;
import com.condominio.vagas.security.WithMockMorador;
import com.condominio.vagas.service.SolicitacaoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SolicitacaoController.class)
class SolicitacaoControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean SolicitacaoService solicitacaoService;
    @MockBean JwtService jwtService;
    @MockBean MoradorRepository moradorRepository;
    @MockBean AdminUserRepository adminUserRepository;
    @MockBean OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Test
    @WithMockMorador
    void listarMinhas_retorna200ComSolicitacoes() throws Exception {
        Solicitacao s = solicitacaoFixture();
        when(solicitacaoService.listarPorMorador(1L)).thenReturn(List.of(s));

        mockMvc.perform(get("/api/solicitacoes/minhas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("PENDENTE"));
    }

    @Test
    @WithMockMorador
    void criarMinha_retorna201() throws Exception {
        Solicitacao s = solicitacaoFixture();
        when(solicitacaoService.salvar(any())).thenReturn(s);

        mockMvc.perform(post("/api/solicitacoes/minhas")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(s)))
                .andExpect(status().isCreated());
    }

    @Test
    @WithMockMorador
    void listarPendentes_retorna200() throws Exception {
        when(solicitacaoService.listarPendentes()).thenReturn(List.of());

        mockMvc.perform(get("/api/solicitacoes"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockMorador
    void cancelar_retorna200ComStatusCancelado() throws Exception {
        Solicitacao s = solicitacaoFixture();
        s.setStatus(StatusSolicitacao.CANCELADA);
        when(solicitacaoService.cancelar(anyLong())).thenReturn(s);

        mockMvc.perform(patch("/api/solicitacoes/1/cancelar").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELADA"));
    }

    private Solicitacao solicitacaoFixture() {
        Morador m = new Morador(); m.setId(1L);
        Solicitacao s = new Solicitacao();
        s.setId(1L);
        s.setMorador(m);
        s.setDataInicio(LocalDate.now().plusDays(1));
        s.setDataFim(LocalDate.now().plusDays(5));
        s.setStatus(StatusSolicitacao.PENDENTE);
        return s;
    }
}
