package com.example.academic_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@Table(name = "Faculty")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique =true, nullable = false)
    private String code;

    @Column(unique = true, nullable = false)
    private String name;

    private String telephone;

    @Column(unique = true, nullable = false, length=150)
    private String email;

    private Long deanId ;

    @OneToMany(mappedBy = "faculty")
    private List<Department> departments;
}
