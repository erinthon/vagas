package com.condominio.vagas.service;

import com.condominio.vagas.model.Morador;
import com.condominio.vagas.repository.MoradorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MoradorService {

    private final MoradorRepository moradorRepository;

    public List<Morador> listarTodos() {
        return moradorRepository.findAll();
    }

    public Morador buscarPorId(Long id) {
        return moradorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Morador não encontrado: " + id));
    }

    public Morador salvar(Morador morador) {
        return moradorRepository.save(morador);
    }

    public Morador atualizar(Long id, Morador dados) {
        Morador morador = buscarPorId(id);
        morador.setNome(dados.getNome());
        morador.setApartamento(dados.getApartamento());
        morador.setBloco(dados.getBloco());
        morador.setEmail(dados.getEmail());
        morador.setTelefone(dados.getTelefone());
        return moradorRepository.save(morador);
    }

    public void excluir(Long id) {
        moradorRepository.deleteById(id);
    }
}
