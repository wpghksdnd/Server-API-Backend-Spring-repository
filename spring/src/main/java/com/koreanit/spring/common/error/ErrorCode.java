package com.koreanit.spring.common.error;

import org.springframework.http.HttpStatus;

public enum ErrorCode { //enum 상수는 값이 아니라 객체 JVM에서 단일인스턴트 객체로 참조

    INVALID_REQUEST(HttpStatus.BAD_REQUEST),   // 400
    NOT_FOUND_RESOURCE(HttpStatus.NOT_FOUND),  // 404
    DUPLICATE_RESOURCE(HttpStatus.CONFLICT),   // 409
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED),      // 401 
    FORBIDDEN(HttpStatus.FORBIDDEN),            // 403 
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR); // 500

    private final HttpStatus status;

    ErrorCode(HttpStatus status) {
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}