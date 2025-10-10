package org.example.expensetracker.service;

import lombok.RequiredArgsConstructor;
import org.example.expensetracker.dto.AuthRequest;
import org.example.expensetracker.dto.AuthResponse;
import org.example.expensetracker.entity.User;
import org.example.expensetracker.exception.IncorrectPasswordException;
import org.example.expensetracker.exception.LoginNotFoundException;
import org.example.expensetracker.mapper.AuthMapper;
import org.example.expensetracker.repository.AuthRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthRepository authRepository;
    private final AuthMapper authMapper;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(AuthRequest authRequest) {
        User userRequest = authMapper.toEntity(authRequest);
        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        User user = authRepository.save(userRequest);

        return new AuthResponse(jwtService.getAccessToken(user.getLogin()));
    }

    public AuthResponse login(AuthRequest authRequest) {
        User user = authRepository.findByLogin(authRequest.getLogin()).orElseThrow(
                () -> new LoginNotFoundException("Incorrect login or password"));

        if (passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            return new AuthResponse(jwtService.getAccessToken(user.getLogin()));
        } else throw new IncorrectPasswordException("Incorrect login or password");
    }
}
