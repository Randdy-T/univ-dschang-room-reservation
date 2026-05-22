package com.example.room_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.room_service.entity.Room;
import com.example.room_service.entity.RoomStatus;
import com.example.room_service.repository.RoomRepository;
import java.util.List;


@Service
public class RoomService {
    @Autowired
    private RoomRepository roomRepository;

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getAvailableRooms() {
        return roomRepository.findByStatus(RoomStatus.AVAILABLE);
    }

    public List<Room> getRoomsByCapacity(int capacity) {
        return roomRepository.findByCapacityGreaterThanEqual(capacity);
    }
}
