package com.condominio.vagas.service;

import com.condominio.vagas.model.Condominio;
import com.condominio.vagas.repository.CondominioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CondominioService {

    private final CondominioRepository repository;

    public List<Condominio> listar() {
        return repository.findAll();
    }

    public Optional<Condominio> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Condominio salvar(Condominio condominio) {
        return repository.save(condominio);
    }

    public Optional<Condominio> atualizar(Long id, Condominio dados) {
        return repository.findById(id).map(c -> {
            c.setNome(dados.getNome());
            c.setCnpj(dados.getCnpj());
            c.setEndereco(dados.getEndereco());
            c.setTelefone(dados.getTelefone());
            c.setEmail(dados.getEmail());
            return repository.save(c);
        });
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
