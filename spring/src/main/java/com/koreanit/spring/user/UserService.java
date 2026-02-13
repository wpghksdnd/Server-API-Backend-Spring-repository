package com.koreanit.spring.user;

//alt + shift + o 자동 import
import java.util.List;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.koreanit.spring.common.error.ApiException;
import com.koreanit.spring.common.error.ErrorCode;
import com.koreanit.spring.security.SecurityUtils;

@Service
public class UserService {

    private static final int MAX_LIMIT = 1000;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private int normalizeLimit(int limit) {
        if (limit <= 0) {
            throw new ApiException(ErrorCode.INVALID_REQUEST, "limit 은 1 이상 입력해주세요");
        }
        return Math.min(limit, MAX_LIMIT);
    }

    public boolean isSelf(Long userId) {
        Long currentUserId = SecurityUtils.currentUserId();
        return currentUserId != null && userId != null && currentUserId.equals(userId);
    }

    public Long create(String username, String nickname, String email, String password) {
        username = username.trim().toLowerCase();
        nickname = nickname.trim().toLowerCase();
        String normalizedEmail = (email == null || email.isBlank()) ? null : email.trim().toLowerCase();

        String hash = passwordEncoder.encode(password);

        try {
            return userRepository.save(username, hash, nickname, normalizedEmail);
        } catch (DuplicateKeyException e) {
            throw new ApiException(ErrorCode.DUPLICATE_RESOURCE, "이미 존재하는 username 또는 nickname 또는 email 입니다.");
        }
        // return userRepository.save(
        // req.getUsername(),
        // hash,
        // req.getNickname(),
        // req.getEmail());

    }

    // 단건조회
    @PreAuthorize("hasRole('ADMIN') or @userService.isSelf(#id)")
    public User get(Long id) {
        try {
            UserEntity e = userRepository.findById(id);
            return UserMapper.toDomain(e);
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException(
                    ErrorCode.NOT_FOUND_RESOURCE,
                    "존재하지 않는 사용자입니다. id=" + id);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<User> list(int limit) {
        int safeLimit = normalizeLimit(limit);
        return UserMapper.toDomainList(userRepository.findAll(safeLimit));
    }

    @PreAuthorize("hasRole('ADMIN') or @userService.isSelf(#id)")
    public void changeNickname(Long id, String nickname) {
        // String nickname = req.getNickname();
        nickname = nickname.trim().toLowerCase();

        // 존재여부확인(단건조회)
        User user = get(id);

        // DB에 있는 닉네임과 요청데이터 닉네임 비교
        if (user.getNickname().equals(nickname)) {
            return;
        }

        int updated = userRepository.updateNickname(id, nickname);

        // 업데이트된 행이 없다면(존재하지 않는 id)
        if (updated == 0) {
            throw new ApiException(
                    ErrorCode.NOT_FOUND_RESOURCE,
                    "닉네임 변경에 실패하였습니다. ID=" + id);
        }
    }

    @PreAuthorize("hasRole('ADMIN') or @userService.isSelf(#id)")
    public void changePassword(Long id, String password) {
        User user = get(id);

        String hash = passwordEncoder.encode(password);

        if (passwordEncoder.matches(password, user.getPassword())) {
            throw new ApiException(
                    ErrorCode.INVALID_REQUEST,
                    "기존비밀번호와 동일한 값은 사용할 수 없습니다. ID=" + id);
        }

        int updated = userRepository.updatePassword(id, hash);
        // 없어도 됨(왠만하면 hash가 같을꺼임, db에 문제가 생기지 않는 한에서)
        if (updated == 0) {
            throw new ApiException(
                    ErrorCode.INVALID_REQUEST,
                    "존재하지 않는 사용자 입니다. ID=" + id);
        }
    }
    @PreAuthorize("hasRole('ADMIN') or @userService.isSelf(#id)")
    public void changeEmail(Long id, String email) {
        email = email.trim().toLowerCase();
        String normalized = (email == null) ? null : email.toLowerCase();
        try {
            userRepository.updateEmail(id, normalized);
        } catch (DuplicateKeyException e) {
            throw new ApiException(ErrorCode.DUPLICATE_RESOURCE, "이메일값이 중복되었습니다.");
        }
    }
    
    @PreAuthorize("hasRole('ADMIN') or @userService.isSelf(#id)")
    public void delete(Long id) {
        int delete = userRepository.deleteById(id);
        if (delete == 0) {
            throw new ApiException(
                    ErrorCode.NOT_FOUND_RESOURCE,
                    "존재하지 않는 사용자입니다. ID=" + id);
        }
    }

    public Long login(String username, String password) {
        try {
            UserEntity en = userRepository.findByUsername(username);
            if (!passwordEncoder.matches(password, en.getPassword())) {
                throw new ApiException(ErrorCode.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다.");
            }
            return en.getId();
        } catch (EmptyResultDataAccessException e) {
            throw new ApiException(ErrorCode.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다.");
        }
    }
}