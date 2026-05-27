package com.example.service_reservation.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import lombok.AllArgsConstructor;


@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlot {
    private LocalDateTime startDateTime;

    private LocalDateTime endDateTime;
}
