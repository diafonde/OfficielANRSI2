package mr.gov.anrsi.service;

import mr.gov.anrsi.dto.LoginRequestDTO;
import mr.gov.anrsi.dto.LoginResponseDTO;
import mr.gov.anrsi.dto.UserDTO;
import mr.gov.anrsi.entity.User;
import mr.gov.anrsi.repository.UserRepository;
import mr.gov.anrsi.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
@ConditionalOnProperty(name = "spring.datasource.url")
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public LoginResponseDTO authenticate(LoginRequestDTO loginRequest) {
        System.out.println("=== AUTH DEBUG: Attempting login for username: " + loginRequest.getUsername());
        
        // Check total users in database
        long totalUsers = userRepository.count();
        System.out.println("=== AUTH DEBUG: Total users in database: " + totalUsers);
        
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> {
                    System.out.println("=== AUTH DEBUG: ❌ User not found: " + loginRequest.getUsername());
                    System.out.println("=== AUTH DEBUG: Available usernames in database:");
                    userRepository.findAll().forEach(u -> System.out.println("  - " + u.getUsername()));
                    return new BadCredentialsException("Invalid username or password");
                });
        
        System.out.println("=== AUTH DEBUG: ✓ User found: " + user.getUsername());
        System.out.println("=== AUTH DEBUG:   - Active: " + user.getIsActive());
        System.out.println("=== AUTH DEBUG:   - Role: " + user.getRole());
        System.out.println("=== AUTH DEBUG:   - Password hash: " + (user.getPassword() != null ? user.getPassword().substring(0, Math.min(20, user.getPassword().length())) + "..." : "null"));
        
        if (!user.getIsActive()) {
            System.out.println("=== AUTH DEBUG: ❌ User account is inactive");
            throw new BadCredentialsException("User account is inactive");
        }
        
        System.out.println("=== AUTH DEBUG: Comparing password...");
        System.out.println("=== AUTH DEBUG:   - Input password: " + loginRequest.getPassword());
        System.out.println("=== AUTH DEBUG:   - Stored password hash: " + user.getPassword());
        System.out.println("=== AUTH DEBUG:   - Hash length: " + (user.getPassword() != null ? user.getPassword().length() : 0));
        System.out.println("=== AUTH DEBUG:   - Hash starts with: " + (user.getPassword() != null && user.getPassword().length() > 10 ? user.getPassword().substring(0, 10) : "N/A"));
        
        // Test encoding the input password to see what it should be
        String testEncoded = passwordEncoder.encode(loginRequest.getPassword());
        System.out.println("=== AUTH DEBUG:   - Test encoding input password: " + testEncoded.substring(0, Math.min(30, testEncoded.length())) + "...");
        System.out.println("=== AUTH DEBUG:   - Test encoding matches stored: " + testEncoded.equals(user.getPassword()));
        
        boolean passwordMatches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
        System.out.println("=== AUTH DEBUG:   - Password matches: " + passwordMatches);
        
        if (!passwordMatches) {
            System.out.println("=== AUTH DEBUG: ❌ Password mismatch");
            throw new BadCredentialsException("Invalid username or password");
        }
        
        System.out.println("=== AUTH DEBUG: ✓ Authentication successful!");
        
        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        
        // Convert user to DTO
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setRole(user.getRole());
        userDTO.setIsActive(user.getIsActive());
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setLastLogin(user.getLastLogin());
        
        LoginResponseDTO response = new LoginResponseDTO();
        response.setUser(userDTO);
        response.setToken(token);
        response.setExpiresIn(3600L); // 1 hour in seconds
        
        return response;
    }
    
    public UserDTO getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("User not found"));
        
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setRole(user.getRole());
        userDTO.setIsActive(user.getIsActive());
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setLastLogin(user.getLastLogin());
        
        return userDTO;
    }
}

