package com.condominio.vagas.service;

import com.condominio.vagas.model.Vaga;
import com.condominio.vagas.repository.VagaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VagaService {

    private final VagaRepository vagaRepository;

    public List<Vaga> listarTodas() {
        return vagaRepository.findAll();
    }

    public Vaga buscarPorId(Long id) {
        return vagaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada: " + id));
    }

    public Vaga salvar(Vaga vaga) {
        return vagaRepository.save(vaga);
    }

    public Vaga atualizar(Long id, Vaga dados) {
        Vaga vaga = buscarPorId(id);
        vaga.setNumero(dados.getNumero());
        vaga.setTipo(dados.getTipo());
        vaga.setProprietario(dados.getProprietario());
        return vagaRepository.save(vaga);
    }

    public void excluir(Long id) {
        vagaRepository.deleteById(id);
    }
}
