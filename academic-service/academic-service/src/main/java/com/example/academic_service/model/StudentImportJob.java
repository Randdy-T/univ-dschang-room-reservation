package com.example.academic_service.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="StudentImportJob")
@Builder
public class StudentImportJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private LocalDateTime importDate;

    private int totalRecords;

    private int successCount;

    private int failureCount;

    private String status;
}
