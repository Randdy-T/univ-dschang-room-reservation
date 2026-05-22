package com.example.room_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.room_service.entity.Campus;

public interface CampusRepository extends JpaRepository<Campus, Long> {
    
}
