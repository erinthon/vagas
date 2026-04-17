package com.condominio.vagas.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

import java.util.List;

public class WithMockMoradorSecurityContextFactory
        implements WithSecurityContextFactory<WithMockMorador> {

    @Override
    public SecurityContext createSecurityContext(WithMockMorador annotation) {
        SecurityContext ctx = SecurityContextHolder.createEmptyContext();
        ctx.setAuthentication(new UsernamePasswordAuthenticationToken(
                annotation.id(), null,
                List.of(new SimpleGrantedAuthority("ROLE_MORADOR"))));
        return ctx;
    }
}
