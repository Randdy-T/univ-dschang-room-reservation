package com.example.academic_service.dto.response;


import com.example.academic_service.model.EnrollmentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CourseEnrollmentResponseDTO {

    private Long id;

    private Long studentId;

    private String studentName;

    private Long courseId;

    private String courseTitle;

    private LocalDateTime enrollmentDate;

    private EnrollmentStatus status;
}
