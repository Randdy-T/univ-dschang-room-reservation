package com.example.academic_service.dto.response;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class FacultyResponseDTO {
    
    private Long id;
    private String code;
    private String name;
    private String telephone;
    private String email;
    private String deanId;
}
