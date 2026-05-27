package com.example.academic_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Builder
@Data
@Table(name = "Departement")
@AllArgsConstructor
@NoArgsConstructor
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    @OneToMany(mappedBy = "department")
    private List<Program> programs;

    @OneToMany(mappedBy = "department")
    private List<Teacher> teachers;

}
