package com.condominio.vagas.security;

import com.condominio.vagas.repository.AdminUserRepository;
import com.condominio.vagas.repository.MoradorRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final MoradorRepository moradorRepository;
    private final AdminUserRepository adminUserRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Claims claims = jwtService.parseToken(token);
                Long id = Long.valueOf(claims.getSubject());
                String role = claims.get("role", String.class);

                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    if ("ADMIN".equals(role) && adminUserRepository.existsById(id)) {
                        var auth = new UsernamePasswordAuthenticationToken(
                                id, null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    } else if ("MORADOR".equals(role) && moradorRepository.existsById(id)) {
                        var auth = new UsernamePasswordAuthenticationToken(
                                id, null, List.of(new SimpleGrantedAuthority("ROLE_MORADOR")));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            } catch (Exception ignored) {
            }
        }
        chain.doFilter(request, response);
    }
}
