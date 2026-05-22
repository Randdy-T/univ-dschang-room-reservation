package com.example.iam_service.controller;

import com.example.iam_service.entity.Permission;
import com.example.iam_service.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/permissions")
public class PermissionController {

    private final PermissionRepository permissionRepository;

    @Autowired
    public PermissionController(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    @GetMapping
    public List<Permission> listPermissions() {
        return permissionRepository.findAll();
    }

    @GetMapping("/{id}")
    public Permission getPermission(@PathVariable Long id) {
        return permissionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permission not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Permission createPermission(@RequestBody Permission permission) {
        return permissionRepository.save(permission);
    }

    @PutMapping("/{id}")
    public Permission updatePermission(@PathVariable Long id, @RequestBody Permission permissionUpdate) {
        Permission permission = getPermission(id);
        if (permissionUpdate.getName() != null) {
            permission.setName(permissionUpdate.getName());
        }
        return permissionRepository.save(permission);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePermission(@PathVariable Long id) {
        Permission permission = getPermission(id);
        permissionRepository.delete(permission);
    }
}

