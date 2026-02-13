package com.koreanit.spring.common.config;

import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI koreanitOpenAPI() {
        final String sessionCookieScheme = "sessionCookie";

        return new OpenAPI()
                .info(new Info()
                        .title("Koreanit Community API")
                        .description("Koreanit 커뮤니티 백엔드 API 문서입니다.\n\n"
                                + "- 공개 API: 게시글 조회, 광고 조회 등\n"
                                + "- 인증 필요 API: 댓글 작성, 좋아요/북마크, 알림 조회\n"
                                + "- 관리자 API: /api/admin/**, /api/ops/health, 광고 관리")
                        .version("v1")
                        .contact(new Contact().name("Koreanit Backend").url("https://github.com/"))
                        .license(new License().name("Portfolio Project")))
                .components(new Components()
                        .addSecuritySchemes(sessionCookieScheme,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.COOKIE)
                                        .name("JSESSIONID")
                                        .description("세션 기반 인증 쿠키")))
                .addSecurityItem(new SecurityRequirement().addList(sessionCookieScheme));
    }

    @Bean
    public OpenApiCustomizer defaultErrorResponsesCustomizer() {
        return openApi -> {
            if (openApi.getPaths() == null) {
                return;
            }

            openApi.getPaths().values().forEach(pathItem ->
                    pathItem.readOperations().forEach(operation -> {
                        ApiResponses responses = operation.getResponses();
                        if (responses == null) {
                            responses = new ApiResponses();
                            operation.setResponses(responses);
                        }

                        responses.putIfAbsent("400", new ApiResponse().description("잘못된 요청 (Validation / 파라미터 오류)"));
                        responses.putIfAbsent("401", new ApiResponse().description("인증 필요 또는 세션 만료"));
                        responses.putIfAbsent("403", new ApiResponse().description("권한 없음"));
                        responses.putIfAbsent("500", new ApiResponse().description("서버 내부 오류"));
                    }));
        };
    }
}
