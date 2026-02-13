package com.koreanit.spring.comment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CommentCreateRequest {
    @NotBlank(message = "content는 필수입니다")
    @Size(max = 100, message = "content는 최대 100자 이하여야 합니다")
    private String content;

    private Long parentId;
    
    public String getContent() { return content; }
    public void setContent(String content) {this.content = content; }

    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
}
