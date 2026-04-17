package com.condominio.vagas.controller;

import com.condominio.vagas.model.Vaga;
import com.condominio.vagas.model.Vaga.TipoVaga;
import com.condominio.vagas.repository.AdminUserRepository;
import com.condominio.vagas.repository.MoradorRepository;
import com.condominio.vagas.security.JwtService;
import com.condominio.vagas.security.OAuth2LoginSuccessHandler;
import com.condominio.vagas.security.WithMockMorador;
import com.condominio.vagas.service.VagaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VagaController.class)
class VagaControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean VagaService vagaService;
    @MockBean JwtService jwtService;
    @MockBean MoradorRepository moradorRepository;
    @MockBean AdminUserRepository adminUserRepository;
    @MockBean OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Test
    @WithMockMorador
    void listarMinhas_retorna200ComLista() throws Exception {
        Vaga vaga = new Vaga(); vaga.setId(1L); vaga.setNumero(10); vaga.setTipo(TipoVaga.COBERTA);
        when(vagaService.listarPorMorador(1L)).thenReturn(List.of(vaga));

        mockMvc.perform(get("/api/vagas/minhas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].numero").value(10));
    }

    @Test
    @WithMockMorador
    void criarMinha_retorna201ComVagaCriada() throws Exception {
        Vaga vaga = new Vaga(); vaga.setId(1L); vaga.setNumero(5); vaga.setTipo(TipoVaga.DESCOBERTA);
        when(vagaService.salvar(any())).thenReturn(vaga);

        mockMvc.perform(post("/api/vagas/minhas")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vaga)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.numero").value(5));
    }

    @Test
    @WithMockMorador
    void listar_retorna200ComTodasAsVagas() throws Exception {
        when(vagaService.listarTodas()).thenReturn(List.of());

        mockMvc.perform(get("/api/vagas"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockMorador
    void excluir_retorna204() throws Exception {
        doNothing().when(vagaService).excluir(anyLong());

        mockMvc.perform(delete("/api/vagas/1").with(csrf()))
                .andExpect(status().isNoContent());
    }
}
