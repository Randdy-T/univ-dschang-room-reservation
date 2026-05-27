package com.example.academic_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Builder
@Data
@Table(name = "Course")
@AllArgsConstructor
@NoArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique =true, nullable = false)
    private String code;

    @Column(unique = true, nullable = false)
    private String title;

    @Column(length = 1000)
    private String description ;

    private int credits;

    private int volumeHoraire;

    private int semestre;

    private String anneeAcademique;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @ManyToOne
    @JoinColumn(name = "level_id")
    private Level level;

    @OneToMany(mappedBy = "course")
    private List<CourseEnrollment> enrollments;
}
