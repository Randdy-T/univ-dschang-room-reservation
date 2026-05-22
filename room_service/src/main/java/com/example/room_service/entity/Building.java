package com.example.room_service.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Building {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

    private String name;
    private String code;

    @ManyToOne
    @JoinColumn(name = "campus_id")
    private Campus campus;

    @OneToMany(mappedBy = "building")
    private List<Room> rooms;
}
