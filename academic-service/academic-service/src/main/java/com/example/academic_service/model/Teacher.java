package com.example.academic_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name = "Teacher")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private Long userId ;

    @Column(nullable = false)
    private Grade grade;

    @Column(nullable = false)
    private String specialite;

    @Column(nullable = false)
    private boolean isHeadOfDepartment;

    private LocalDate dateNomination;

    private int mandatAnnee;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToMany(mappedBy = "teacher")
    private List<Course> courses;
}
