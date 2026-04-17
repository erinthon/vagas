package com.condominio.vagas.controller;

import com.condominio.vagas.model.Morador;
import com.condominio.vagas.model.Oferta;
import com.condominio.vagas.model.Oferta.StatusOferta;
import com.condominio.vagas.model.Vaga;
import com.condominio.vagas.repository.AdminUserRepository;
import com.condominio.vagas.repository.MoradorRepository;
import com.condominio.vagas.security.JwtService;
import com.condominio.vagas.security.OAuth2LoginSuccessHandler;
import com.condominio.vagas.security.WithMockMorador;
import com.condominio.vagas.service.OfertaService;
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

@WebMvcTest(OfertaController.class)
class OfertaControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean OfertaService ofertaService;
    @MockBean JwtService jwtService;
    @MockBean MoradorRepository moradorRepository;
    @MockBean AdminUserRepository adminUserRepository;
    @MockBean OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Test
    @WithMockMorador
    void listarMinhas_retorna200ComOfertas() throws Exception {
        Oferta o = ofertaFixture();
        when(ofertaService.listarPorMorador(1L)).thenReturn(List.of(o));

        mockMvc.perform(get("/api/ofertas/minhas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("ATIVA"));
    }

    @Test
    @WithMockMorador
    void criarMinha_retorna201() throws Exception {
        Oferta o = ofertaFixture();
        when(ofertaService.salvar(any())).thenReturn(o);

        mockMvc.perform(post("/api/ofertas/minhas")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(o)))
                .andExpect(status().isCreated());
    }

    @Test
    @WithMockMorador
    void listar_semFiltro_retorna200ComAtivas() throws Exception {
        when(ofertaService.listarAtivas()).thenReturn(List.of());

        mockMvc.perform(get("/api/ofertas"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockMorador
    void encerrar_retorna200ComOfertaEncerrada() throws Exception {
        Oferta o = ofertaFixture();
        o.setStatus(StatusOferta.ENCERRADA);
        when(ofertaService.encerrar(anyLong())).thenReturn(o);

        mockMvc.perform(patch("/api/ofertas/1/encerrar").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ENCERRADA"));
    }

    private Oferta ofertaFixture() {
        Morador m = new Morador(); m.setId(1L);
        Vaga v = new Vaga(); v.setId(10L);
        Oferta o = new Oferta();
        o.setId(1L);
        o.setMorador(m);
        o.setVaga(v);
        o.setDataInicio(LocalDate.now().plusDays(1));
        o.setDataFim(LocalDate.now().plusDays(10));
        o.setStatus(StatusOferta.ATIVA);
        return o;
    }
}
