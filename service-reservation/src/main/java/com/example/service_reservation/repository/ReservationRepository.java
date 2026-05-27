package com.example.service_reservation.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.service_reservation.entity.Reservation;
import com.example.service_reservation.entity.ReservationStatus;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
      List<Reservation> findByStatus(
        ReservationStatus status
    );

    List<Reservation> findByExpiresAtBeforeAndStatus(
            LocalDateTime dateTime,
            ReservationStatus status
    );
    @Query("""
       SELECT COUNT(r) > 0
       FROM Reservation r
       WHERE r.roomId = :roomId
       AND r.status <> 'CANCELLED'
       AND r.status <> 'EXPIRED'
       AND r.timeSlot.startDateTime < :endDate
       AND r.timeSlot.endDateTime > :startDate
       """)
boolean existsConflict(
        @Param("roomId") Long roomId,
        @Param("startDate") java.time.LocalDateTime startDate,
        @Param("endDate") java.time.LocalDateTime endDate
);
}
