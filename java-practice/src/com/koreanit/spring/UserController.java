package com.koreanit.spring;
import java.util.Map;

//컨트롤러는 리턴만
public class UserController {

    private final UserService userService; // 멤버변수

    public UserController(UserService userService) { // 생성자
        this.userService = userService;
    }

    public String hello(Map<String, Object> body) {
        return userService.getHelloMessage(body);
    }
}
