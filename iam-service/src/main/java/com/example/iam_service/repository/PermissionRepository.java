package com.example.iam_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.iam_service.entity.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
}
