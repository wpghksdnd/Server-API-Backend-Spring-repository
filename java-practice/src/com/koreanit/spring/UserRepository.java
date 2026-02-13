package com.koreanit.spring;

import java.util.HashMap;
import java.util.Map;

public class UserRepository {
    // DB를 흉내낸 저장소
    private final Map<String, Integer> users = new HashMap<>();

    public UserRepository() {
        // 초기 데이터
        users.put("user1", 20);
        users.put("user2", 30);
    }

    public Integer findAgeByUsername(String username) {
        return users.get(username); // 없으면 null
    }

    
}
