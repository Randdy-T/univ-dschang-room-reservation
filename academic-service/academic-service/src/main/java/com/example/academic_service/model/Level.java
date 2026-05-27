package com.example.academic_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@Table(name = "Level")
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Level {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique =true, nullable = false)
    private String code;

    @Column( nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Integer capacity;

    @ManyToOne
    @JoinColumn(name = "program_id")
    private Program program;

    @OneToMany(mappedBy = "level")
    private List<Course> courses;

    @OneToMany(mappedBy = "level")
    private List<Student> students;
}
