package com.koreanit.spring.common.response;

public class ApiResponse<T> { //<T> 제네릭 타입: 데이터 타입을 유동적으로 받아오기위해

    private final boolean success;
    private final String message;
    private final T data; //객체,배열,일반값등 여러개의 타입일수있기에 제너릭으로, new ApiResponse 할때 타입지정
    private final String code;   // 실패 식별자

    private ApiResponse(boolean success, String message, T data, String code) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.code = code;
    }

    public boolean getSuccess() { return success; }
    public String getMessage() { return message; }
    public T getData() { return data; }
    public String getCode() { return code; }

    /* ---------- 성공 ---------- */
    //메서드 오버로딩
    public static <T> ApiResponse<T> ok(T data) { //static 메서드도 클래스 외부에서 접근가능
        return new ApiResponse<>(true, "OK", data, null);
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data, null);
    }
        
    public static ApiResponse<Void> ok() {
        return new ApiResponse<>(true, "OK", null, null);
    }

    public static ApiResponse<Void> ok(String message) {
        return new ApiResponse<>(true, message, null, null);
    }

    /* ---------- 실패 ---------- */

    public static ApiResponse<Void> fail(String code, String message) {
        return new ApiResponse<>(false, message, null, code);
    }
}