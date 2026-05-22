package com.example.iam_service.controller;

import com.example.iam_service.entity.Permission;
import com.example.iam_service.entity.Role;
import com.example.iam_service.repository.PermissionRepository;
import com.example.iam_service.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/roles")
public class RoleController {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Autowired
    public RoleController(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    @GetMapping
    public List<Role> listRoles() {
        return roleRepository.findAll();
    }

    @GetMapping("/{id}")
    public Role getRole(@PathVariable Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Role createRole(@RequestBody Role role) {
        if (role.getPermissions() != null) {
            role.setPermissions(resolvePermissions(role.getPermissions()));
        }
        return roleRepository.save(role);
    }

    @PutMapping("/{id}")
    public Role updateRole(@PathVariable Long id, @RequestBody Role roleUpdate) {
        Role role = getRole(id);
        if (roleUpdate.getName() != null) {
            role.setName(roleUpdate.getName());
        }
        if (roleUpdate.getPermissions() != null) {
            role.setPermissions(resolvePermissions(roleUpdate.getPermissions()));
        }
        return roleRepository.save(role);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRole(@PathVariable Long id) {
        Role role = getRole(id);
        roleRepository.delete(role);
    }

    private Set<Permission> resolvePermissions(Set<Permission> permissions) {
        if (permissions == null || permissions.isEmpty()) {
            return new HashSet<>();
        }
        Set<Long> ids = permissions.stream()
                .map(Permission::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        if (ids.isEmpty()) {
            return new HashSet<>();
        }
        return new HashSet<>(permissionRepository.findAllById(ids));
    }
}

