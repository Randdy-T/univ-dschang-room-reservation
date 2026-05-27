package com.example.academic_service.model;

import lombok.*;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name= "Student")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private Long userId;

    private LocalDate dateNaissance;

    private String lieuNaissance;

    private String adresse;

    private int anneeEntree;
    
    private String parentPhone;

    @ManyToOne
    @JoinColumn(name = "level_id")
    private Level level;

    @ManyToOne
    @JoinColumn(name = "program_id")
    private Program program;
   
    @OneToMany(mappedBy = "student")
    private List<CourseEnrollment> enrollments;
}
