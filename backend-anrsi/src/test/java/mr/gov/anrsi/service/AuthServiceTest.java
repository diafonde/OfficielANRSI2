package mr.gov.anrsi.service;

import mr.gov.anrsi.dto.LoginRequestDTO;
import mr.gov.anrsi.dto.LoginResponseDTO;
import mr.gov.anrsi.dto.UserDTO;
import mr.gov.anrsi.entity.User;
import mr.gov.anrsi.repository.UserRepository;
import mr.gov.anrsi.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private LoginRequestDTO loginRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("$2a$10$encodedPassword");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setRole(User.Role.ADMIN);
        testUser.setIsActive(true);
        testUser.setCreatedAt(LocalDateTime.now());

        loginRequest = new LoginRequestDTO();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");
    }

    @Test
    void authenticate_WithValidCredentials_ShouldReturnLoginResponse() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", testUser.getPassword())).thenReturn(true);
        when(jwtUtil.generateToken("testuser", "ADMIN")).thenReturn("test-jwt-token");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        LoginResponseDTO response = authService.authenticate(loginRequest);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("test-jwt-token", response.getToken());
        assertNotNull(response.getUser());
        assertEquals("testuser", response.getUser().getUsername());
        assertEquals(3600L, response.getExpiresIn());
        verify(userRepository, times(1)).findByUsername("testuser");
        verify(passwordEncoder, times(1)).matches("password123", testUser.getPassword());
        verify(jwtUtil, times(1)).generateToken("testuser", "ADMIN");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void authenticate_WithInvalidUsername_ShouldThrowException() {
        // Arrange
        when(userRepository.findByUsername("invaliduser")).thenReturn(Optional.empty());
        loginRequest.setUsername("invaliduser");

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> authService.authenticate(loginRequest));
        verify(userRepository, times(1)).findByUsername("invaliduser");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).generateToken(anyString(), anyString());
    }

    @Test
    void authenticate_WithInvalidPassword_ShouldThrowException() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", testUser.getPassword())).thenReturn(false);
        loginRequest.setPassword("wrongpassword");

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> authService.authenticate(loginRequest));
        verify(userRepository, times(1)).findByUsername("testuser");
        verify(passwordEncoder, times(1)).matches("wrongpassword", testUser.getPassword());
        verify(jwtUtil, never()).generateToken(anyString(), anyString());
    }

    @Test
    void authenticate_WithInactiveUser_ShouldThrowException() {
        // Arrange
        testUser.setIsActive(false);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> authService.authenticate(loginRequest));
        verify(userRepository, times(1)).findByUsername("testuser");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).generateToken(anyString(), anyString());
    }

    @Test
    void getCurrentUser_WithValidUsername_ShouldReturnUserDTO() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // Act
        UserDTO result = authService.getCurrentUser("testuser");

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());
        assertEquals(User.Role.ADMIN, result.getRole());
        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    void getCurrentUser_WithInvalidUsername_ShouldThrowException() {
        // Arrange
        when(userRepository.findByUsername("invaliduser")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> authService.getCurrentUser("invaliduser"));
        verify(userRepository, times(1)).findByUsername("invaliduser");
    }
}

