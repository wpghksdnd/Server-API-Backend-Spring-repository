package com.koreanit.spring.user.dto.request;

import jakarta.validation.constraints.Email;

public class UserEmailChangeRequest {
    @Email(message = "email 형식이 올바르지 않습니다") //주입되기전에 검증해서 주입, 형식이 다르면 컨트롤러 오기 전에 에러
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}