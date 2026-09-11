package br.com.fiap.zelo.config;

import br.com.fiap.zelo.security.RedirecionadorPorPerfilSuccessHandler;
import br.com.fiap.zelo.security.ZeloUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

/**
 * Autenticacao e autorizacao por perfil (requisito de Java Advanced -
 * Sprint 3, 30 pontos): dois ou mais tipos de usuario com permissoes
 * diferentes e protecao de rotas conforme o perfil.
 *
 * Perfis (ver {@link br.com.fiap.zelo.domain.enums.TipoUsuario}):
 *  - TUTOR: area /tutor/**
 *  - VETERINARIO e GESTOR: area /clinica/**
 *  - GESTOR (exclusivo): administracao do cadastro da clinica em /clinica/gerenciar/**
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(ZeloUserDetailsService zeloUserDetailsService) {
        return zeloUserDetailsService;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserDetailsService userDetailsService,
                                                              PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {
        return new RedirecionadorPorPerfilSuccessHandler();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, DaoAuthenticationProvider authenticationProvider,
                                            AuthenticationSuccessHandler successHandler) throws Exception {
        http
            .authenticationProvider(authenticationProvider)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/login", "/registro", "/registro/**", "/css/**", "/js/**", "/webjars/**", "/h2-console/**").permitAll()
                .requestMatchers("/clinica/gerenciar/**").hasRole("GESTOR")
                .requestMatchers("/clinica/**").hasAnyRole("VETERINARIO", "GESTOR")
                .requestMatchers("/tutor/**").hasRole("TUTOR")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .successHandler(successHandler)
                .failureUrl("/login?erro")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?sair")
                .permitAll()
            )
            // O console do H2 (apenas perfil "dev", para inspecionar o banco durante o
            // desenvolvimento e o video de demonstracao) roda em frame e usa POST sem
            // token CSRF proprio; por isso essas duas excecoes ficam restritas a esse path.
            .csrf(csrf -> csrf.ignoringRequestMatchers("/h2-console/**"))
            .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin));

        return http.build();
    }
}
