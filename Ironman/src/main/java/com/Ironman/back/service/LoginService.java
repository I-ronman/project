package com.Ironman.back.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.Ironman.back.entity.UserEntity;
import com.Ironman.back.repo.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;


@Service
@RequiredArgsConstructor
public class LoginService {

    private final UserRepository userRepository;

    public UserEntity login(String email, String pw) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "존재하지 않는 이메일입니다."));

        if (!user.getPw().equals(pw)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "비밀번호가 일치하지 않습니다.");
        }

        // 일반 로그인일 경우 401 에러가 발생해서 추가
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
        	user.getEmail(),  // principal
        	null,  // credentials
        	List.of(new SimpleGrantedAuthority("ROLE_USER")) // 권한
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        
        return user; // 로그인 성공 시 사용자 정보 반환
    }
}
