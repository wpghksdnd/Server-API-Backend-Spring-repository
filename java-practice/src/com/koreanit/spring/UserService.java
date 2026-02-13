package com.koreanit.spring;

import java.util.Map;

public class UserService {
    // service 역할
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String getHelloMessage(Map<String, Object> body) {

        String username = (String) body.get("username");

        if (username == null || username.isBlank()) {
            username = "guest";
        }

        // 비즈니스 규칙 (판단)
        if ("admin".equals(username)) {
            throw new IllegalArgumentException("admin은 사용할 수 없는 이름입니다");
        }

        // 데이터 조회는 Repository에 위임
        Integer age = userRepository.findAgeByUsername(username);
        if (age == null) {
            age = 0;
        }

        return "안녕 " + username + " (" + age + "세)";
    }
}