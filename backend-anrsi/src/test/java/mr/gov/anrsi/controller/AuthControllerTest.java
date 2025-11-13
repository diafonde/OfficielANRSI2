package mr.gov.anrsi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import mr.gov.anrsi.dto.LoginRequestDTO;
import mr.gov.anrsi.dto.LoginResponseDTO;
import mr.gov.anrsi.dto.UserDTO;
import mr.gov.anrsi.entity.User;
import mr.gov.anrsi.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    private LoginRequestDTO loginRequest;
    private LoginResponseDTO loginResponse;
    private UserDTO userDTO;

    @BeforeEach
    void setUp() {
        loginRequest = new LoginRequestDTO();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setUsername("testuser");
        userDTO.setEmail("test@example.com");
        userDTO.setRole(User.Role.ADMIN);
        userDTO.setIsActive(true);

        loginResponse = new LoginResponseDTO();
        loginResponse.setUser(userDTO);
        loginResponse.setToken("test-jwt-token");
        loginResponse.setExpiresIn(3600L);
    }

    @Test
    void login_WithValidCredentials_ShouldReturnToken() throws Exception {
        // Arrange
        when(authService.authenticate(any(LoginRequestDTO.class))).thenReturn(loginResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("test-jwt-token"))
                .andExpect(jsonPath("$.user.username").value("testuser"))
                .andExpect(jsonPath("$.expiresIn").value(3600L));

        verify(authService, times(1)).authenticate(any(LoginRequestDTO.class));
    }

    @Test
    @WithMockUser(username = "testuser")
    void getCurrentUser_WhenAuthenticated_ShouldReturnUser() throws Exception {
        // Arrange
        when(authService.getCurrentUser("testuser")).thenReturn(userDTO);

        // Act & Assert
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(authService, times(1)).getCurrentUser("testuser");
    }
}

