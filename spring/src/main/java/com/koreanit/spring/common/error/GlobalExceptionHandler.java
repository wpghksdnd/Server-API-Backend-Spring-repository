package com.koreanit.spring.common.error;

import java.nio.file.AccessDeniedException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.koreanit.spring.common.response.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private String origin(Throwable e) {
        StackTraceElement[] trace = e.getStackTrace();
        if (trace == null || trace.length == 0)
            return "unknown";

        for (StackTraceElement el : trace) {
            if (el.getClassName().startsWith("com.koreanit.")) {
                return el.getClassName() + ":" + el.getLineNumber();
            }
        }

        StackTraceElement top = trace[0];
        return top.getClassName() + ":" + top.getLineNumber();
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleApiException(ApiException e) {
        ErrorCode code = e.getErrorCode();
        log.warn("[API_ERROR] code={} message=\"{}\" origin={}", code.name(), e.getMessage(), origin(e));
        return ResponseEntity.status(code.getStatus()).body(ApiResponse.fail(code.name(), e.getMessage()));
    }

    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateKey(DuplicateKeyException e) {
        log.warn("[DUPLICATE_KEY] origin={} message={}", origin(e), e.getMessage());
        return ResponseEntity
                .status(ErrorCode.DUPLICATE_RESOURCE.getStatus())
                .body(ApiResponse.fail(ErrorCode.DUPLICATE_RESOURCE.name(), "이미 존재하는 값입니다."));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleBodyMissing(HttpMessageNotReadableException e) {
        log.warn("[INVALID_BODY] origin={}", origin(e));
        return ResponseEntity
                .status(ErrorCode.INVALID_REQUEST.getStatus())
                .body(ApiResponse.fail(ErrorCode.INVALID_REQUEST.name(), "요청 바디가 비어 있거나 형식이 올바르지 않습니다"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException e) {
        FieldError error = e.getBindingResult().getFieldError();
        String message = (error != null && error.getDefaultMessage() != null && !error.getDefaultMessage().isBlank())
                ? error.getDefaultMessage()
                : "요청 값이 올바르지 않습니다";

        log.warn("[VALIDATION_FAIL] message=\"{}\" origin={}", message, origin(e));
        return ResponseEntity
                .status(ErrorCode.INVALID_REQUEST.getStatus())
                .body(ApiResponse.fail(ErrorCode.INVALID_REQUEST.name(), message));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNoResource(NoResourceFoundException e) {
        log.warn("[NO_RESOURCE] origin={}", origin(e));
        return ResponseEntity
                .status(ErrorCode.NOT_FOUND_RESOURCE.getStatus())
                .body(ApiResponse.fail(ErrorCode.NOT_FOUND_RESOURCE.name(), "리소스를 찾을 수 없습니다."));
    }

    @ExceptionHandler({ AuthorizationDeniedException.class, AccessDeniedException.class })
    public ResponseEntity<ApiResponse<Void>> handleForbidden(Exception e) {
        log.warn("[FORBIDDEN] message=\"{}\" origin={}", e.getMessage(), origin(e));
        return ResponseEntity
                .status(ErrorCode.FORBIDDEN.getStatus())
                .body(ApiResponse.fail(ErrorCode.FORBIDDEN.name(), "권한이 없습니다"));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolation(DataIntegrityViolationException e) {
        log.warn("[DATA_INTEGRITY] origin={} message={}", origin(e), e.getMessage());
        return ResponseEntity
                .status(ErrorCode.INVALID_REQUEST.getStatus())
                .body(ApiResponse.fail(ErrorCode.INVALID_REQUEST.name(), "요청 데이터가 제약조건을 위반했습니다."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        log.error("[INTERNAL_ERROR] origin={}", origin(e), e);
        return ResponseEntity
                .status(ErrorCode.INTERNAL_ERROR.getStatus())
                .body(ApiResponse.fail(ErrorCode.INTERNAL_ERROR.name(), "서버 내부 오류가 발생했습니다."));
    }
}
