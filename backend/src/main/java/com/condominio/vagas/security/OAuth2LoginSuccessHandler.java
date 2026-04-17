package com.condominio.vagas.security;

import com.condominio.vagas.model.Morador;
import com.condominio.vagas.repository.MoradorRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final MoradorRepository moradorRepository;
    private final JwtService jwtService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();

        String googleId = oidcUser.getSubject();
        String email    = oidcUser.getEmail();
        String nome     = oidcUser.getFullName();
        String foto     = oidcUser.getPicture();

        Morador morador = moradorRepository.findByGoogleId(googleId)
                .orElseGet(() -> moradorRepository.findByEmail(email)
                        .orElseGet(Morador::new));

        morador.setGoogleId(googleId);
        morador.setEmail(email);
        morador.setNome(nome != null ? nome : email);
        morador.setFotoPerfil(foto);
        if (morador.getApartamento() == null) morador.setApartamento("");
        if (morador.getBloco() == null) morador.setBloco("");

        morador = moradorRepository.save(morador);

        String token = jwtService.generateToken(morador.getId(), email, morador.getNome());
        response.sendRedirect(frontendUrl + "/auth/callback?token=" + token);
    }
}
