package com.example.academic_service.dto.response;
import lombok.*;

@Data

public class LevelResponseDTO {
     private Long id;

    private String code;

    private String name;

    private String description;

    private int capacity;

    private Long programId;

    private String programName;  
}
