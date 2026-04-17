package com.condominio.vagas.service;

import com.condominio.vagas.dto.CondominioRegistroRequest;
import com.condominio.vagas.exception.RegraDeNegocioException;
import com.condominio.vagas.model.Cargo;
import com.condominio.vagas.model.Condominio;
import com.condominio.vagas.model.Morador;
import com.condominio.vagas.repository.CargoRepository;
import com.condominio.vagas.repository.CondominioRepository;
import com.condominio.vagas.repository.MoradorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CondominioService {

    private final CondominioRepository repository;
    private final CargoRepository cargoRepository;
    private final MoradorRepository moradorRepository;

    public List<Condominio> listar() {
        return repository.findAll();
    }

    public Optional<Condominio> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public Condominio registrar(CondominioRegistroRequest request) {
        Condominio condominio = new Condominio();
        condominio.setNome(request.getNome());
        condominio.setCnpj(request.getCnpj());
        condominio.setEndereco(request.getEndereco());
        condominio.setTelefone(request.getTelefone());
        condominio.setEmail(request.getEmail());
        condominio = repository.save(condominio);

        Cargo cargo = new Cargo();
        cargo.setNome("Síndico");
        cargo.setCondominio(condominio);
        cargo = cargoRepository.save(cargo);

        if (request.getMoradorId() != null) {
            Morador morador = moradorRepository.findById(request.getMoradorId())
                    .orElseThrow(() -> new RegraDeNegocioException("Morador não encontrado."));
            if (morador.getCondominio() != null) {
                throw new RegraDeNegocioException("Morador já está vinculado a outro condomínio.");
            }
            morador.setCondominio(condominio);
            morador.setCargo(cargo);
            moradorRepository.save(morador);
        } else {
            if (request.getResponsavelNome() == null || request.getResponsavelNome().isBlank() ||
                request.getResponsavelEmail() == null || request.getResponsavelEmail().isBlank()) {
                throw new RegraDeNegocioException("Informe o síndico responsável ou selecione um morador existente.");
            }
            Morador responsavel = new Morador();
            responsavel.setNome(request.getResponsavelNome());
            responsavel.setEmail(request.getResponsavelEmail());
            responsavel.setApartamento(request.getResponsavelApartamento() != null ? request.getResponsavelApartamento() : "");
            responsavel.setBloco(request.getResponsavelBloco() != null ? request.getResponsavelBloco() : "");
            responsavel.setTelefone(request.getResponsavelTelefone());
            responsavel.setCondominio(condominio);
            responsavel.setCargo(cargo);
            moradorRepository.save(responsavel);
        }

        return condominio;
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
