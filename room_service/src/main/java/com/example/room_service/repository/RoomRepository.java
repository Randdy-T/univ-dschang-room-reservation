package com.example.room_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.room_service.entity.Room;
import com.example.room_service.entity.RoomStatus;

public interface RoomRepository extends JpaRepository<Room, Long>   {
    List<Room> findByCapacityGreaterThanEqual(int capacity);

    List<Room> findByStatus(RoomStatus status);
}
