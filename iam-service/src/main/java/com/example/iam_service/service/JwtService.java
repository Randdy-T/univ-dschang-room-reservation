package com.example.iam_service.service;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.iam_service.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;




@Service
public class JwtService {

    private static final byte[] SECRET = "my-very-secure-secret-key-123456".getBytes(StandardCharsets.UTF_8);

    public String generateToken(User user) {
        // extraire les rôles de l'utilisateur
        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList());
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getId())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
                .signWith(Keys.hmacShaKeyFor(SECRET), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
  
public List<String> extractRoles(String token) {
    Claims claims = Jwts.parserBuilder()
            .setSigningKey(SECRET)
            .build()
            .parseClaimsJws(token)
            .getBody();
    Object rolesObject = claims.get("roles");
    if (!(rolesObject instanceof List<?> rolesList)) {
        return List.of();
    }
    return rolesList.stream()
            .filter(String.class::isInstance)
            .map(String.class::cast)
            .collect(Collectors.toList());
}
public boolean isTokenValid(String token) {
    try {
        Jwts.parserBuilder()
            .setSigningKey(SECRET)
            .build()
            .parseClaimsJws(token);
        return true;
    } catch (Exception e) {
        return false;
    }
}

}
