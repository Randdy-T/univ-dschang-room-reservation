package com.example.academic_service.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class StudentImportJobResponseDTO {

    private Long id;

    private String fileName;

    private LocalDateTime importDate;

    private int totalRecords;

    private int successCount;

    private int failureCount;

    private String status;
}