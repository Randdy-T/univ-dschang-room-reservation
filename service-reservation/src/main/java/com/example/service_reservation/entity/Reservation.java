package com.example.service_reservation.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Identifiant de la salle provenant du microservice Salle
     */
    @Column(nullable = false)
    private Long roomId;

    /**
     * Utilisateur ayant effectué la réservation
     * (provenant du microservice IAM)
     */
    @Column(nullable = false)
    private Long reservedByUserId;

    /**
     * Niveau concerné
     * (provenant du microservice Académique)
     */
    @Column(nullable = false)
    private Long levelId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationType reservationType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    @Embedded
    private TimeSlot timeSlot;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;
}
