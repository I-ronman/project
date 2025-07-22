package com.Ironman.back.service;

import com.Ironman.back.entity.UserEntity;
import com.Ironman.back.repo.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

@Service
public class OAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oauth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oauth2User.getAttributes();

        // 구글 로그인 기준 정보
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        // 사용자 자동 등록 로직 추가
        UserEntity user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new UserEntity();
            user.setEmail(email);
            user.setName(name);
            userRepository.save(user);
        }

        return oauth2User;
    }
}
