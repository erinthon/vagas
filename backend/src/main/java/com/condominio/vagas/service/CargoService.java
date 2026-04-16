package com.condominio.vagas.service;

import com.condominio.vagas.model.Cargo;
import com.condominio.vagas.model.Condominio;
import com.condominio.vagas.repository.CargoRepository;
import com.condominio.vagas.repository.CondominioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CargoService {

    private final CargoRepository cargoRepository;
    private final CondominioRepository condominioRepository;

    public List<Cargo> listarPorCondominio(Long condominioId) {
        return cargoRepository.findByCondominioId(condominioId);
    }

    public Cargo salvar(Long condominioId, Cargo cargo) {
        Condominio condominio = condominioRepository.findById(condominioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Condomínio não encontrado"));
        cargo.setCondominio(condominio);
        return cargoRepository.save(cargo);
    }

    public Optional<Cargo> atualizar(Long id, Cargo dados) {
        return cargoRepository.findById(id).map(c -> {
            c.setNome(dados.getNome());
            return cargoRepository.save(c);
        });
    }

    public void deletar(Long id) {
        cargoRepository.deleteById(id);
    }
}
