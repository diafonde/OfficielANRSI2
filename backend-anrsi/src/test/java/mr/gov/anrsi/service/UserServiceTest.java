// package mr.gov.anrsi.service;

// import mr.gov.anrsi.dto.UserCreateDTO;
// import mr.gov.anrsi.dto.UserDTO;
// import mr.gov.anrsi.entity.User;
// import mr.gov.anrsi.exception.UserNotFoundException;
// import mr.gov.anrsi.repository.UserRepository;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;
// import org.springframework.security.crypto.password.PasswordEncoder;

// import java.time.LocalDateTime;
// import java.util.Arrays;
// import java.util.List;
// import java.util.Optional;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.*;

// @ExtendWith(MockitoExtension.class)
// class UserServiceTest {

//     @Mock
//     private UserRepository userRepository;

//     @Mock
//     private PasswordEncoder passwordEncoder;

//     @InjectMocks
//     private UserService userService;

//     private User testUser;
//     private UserCreateDTO testUserCreateDTO;

//     @BeforeEach
//     void setUp() {
//         testUser = new User();
//         testUser.setId(1L);
//         testUser.setUsername("testuser");
//         testUser.setEmail("test@example.com");
//         testUser.setPassword("encodedPassword");
//         testUser.setFirstName("Test");
//         testUser.setLastName("User");
//         testUser.setRole(User.Role.ADMIN);
//         testUser.setIsActive(true);
//         testUser.setCreatedAt(LocalDateTime.now());

//         testUserCreateDTO = new UserCreateDTO();
//         testUserCreateDTO.setUsername("newuser");
//         testUserCreateDTO.setEmail("new@example.com");
//         testUserCreateDTO.setPassword("password123");
//         testUserCreateDTO.setFirstName("New");
//         testUserCreateDTO.setLastName("User");
//         testUserCreateDTO.setRole(User.Role.EDITOR);
//         testUserCreateDTO.setIsActive(true);
//     }

//     @Test
//     void getAllUsers_ShouldReturnAllUsers() {
//         // Arrange
//         User user2 = new User();
//         user2.setId(2L);
//         user2.setUsername("user2");
//         when(userRepository.findAll()).thenReturn(Arrays.asList(testUser, user2));

//         // Act
//         List<UserDTO> result = userService.getAllUsers();

//         // Assert
//         assertNotNull(result);
//         assertEquals(2, result.size());
//         verify(userRepository, times(1)).findAll();
//     }

//     @Test
//     void getUserById_WhenUserExists_ShouldReturnUser() {
//         // Arrange
//         when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

//         // Act
//         UserDTO result = userService.getUserById(1L);

//         // Assert
//         assertNotNull(result);
//         assertEquals(1L, result.getId());
//         assertEquals("testuser", result.getUsername());
//         verify(userRepository, times(1)).findById(1L);
//     }

//     @Test
//     void getUserById_WhenUserNotFound_ShouldThrowException() {
//         // Arrange
//         when(userRepository.findById(999L)).thenReturn(Optional.empty());

//         // Act & Assert
//         assertThrows(UserNotFoundException.class, () -> userService.getUserById(999L));
//         verify(userRepository, times(1)).findById(999L);
//     }

//     @Test
//     void createUser_WithValidData_ShouldCreateUser() {
//         // Arrange
//         when(userRepository.existsByUsername("newuser")).thenReturn(false);
//         when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
//         when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
//         when(userRepository.save(any(User.class))).thenReturn(testUser);

//         // Act
//         UserDTO result = userService.createUser(testUserCreateDTO);

//         // Assert
//         assertNotNull(result);
//         verify(userRepository, times(1)).existsByUsername("newuser");
//         verify(userRepository, times(1)).existsByEmail("new@example.com");
//         verify(passwordEncoder, times(1)).encode("password123");
//         verify(userRepository, times(1)).save(any(User.class));
//     }

//     @Test
//     void createUser_WithExistingUsername_ShouldThrowException() {
//         // Arrange
//         when(userRepository.existsByUsername("newuser")).thenReturn(true);

//         // Act & Assert
//         assertThrows(IllegalArgumentException.class, () -> userService.createUser(testUserCreateDTO));
//         verify(userRepository, times(1)).existsByUsername("newuser");
//         verify(userRepository, never()).save(any(User.class));
//     }

//     @Test
//     void createUser_WithExistingEmail_ShouldThrowException() {
//         // Arrange
//         when(userRepository.existsByUsername("newuser")).thenReturn(false);
//         when(userRepository.existsByEmail("new@example.com")).thenReturn(true);

//         // Act & Assert
//         assertThrows(IllegalArgumentException.class, () -> userService.createUser(testUserCreateDTO));
//         verify(userRepository, times(1)).existsByUsername("newuser");
//         verify(userRepository, times(1)).existsByEmail("new@example.com");
//         verify(userRepository, never()).save(any(User.class));
//     }

//     @Test
//     void updateUser_WhenUserExists_ShouldUpdateUser() {
//         // Arrange
//         when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
//         when(userRepository.existsByUsername("newuser")).thenReturn(false);
//         when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
//         when(passwordEncoder.encode("newpassword")).thenReturn("newEncodedPassword");
//         testUserCreateDTO.setPassword("newpassword");
//         when(userRepository.save(any(User.class))).thenReturn(testUser);

//         // Act
//         UserDTO result = userService.updateUser(1L, testUserCreateDTO);

//         // Assert
//         assertNotNull(result);
//         verify(userRepository, times(1)).findById(1L);
//         verify(userRepository, times(1)).save(any(User.class));
//     }

//     @Test
//     void updateUser_WhenUserNotFound_ShouldThrowException() {
//         // Arrange
//         when(userRepository.findById(999L)).thenReturn(Optional.empty());

//         // Act & Assert
//         assertThrows(UserNotFoundException.class, () -> userService.updateUser(999L, testUserCreateDTO));
//         verify(userRepository, times(1)).findById(999L);
//         verify(userRepository, never()).save(any(User.class));
//     }

//     @Test
//     void deleteUser_WhenUserExists_ShouldDeleteUser() {
//         // Arrange
//         when(userRepository.existsById(1L)).thenReturn(true);

//         // Act
//         userService.deleteUser(1L);

//         // Assert
//         verify(userRepository, times(1)).existsById(1L);
//         verify(userRepository, times(1)).deleteById(1L);
//     }

//     @Test
//     void deleteUser_WhenUserNotFound_ShouldThrowException() {
//         // Arrange
//         when(userRepository.existsById(999L)).thenReturn(false);

//         // Act & Assert
//         assertThrows(UserNotFoundException.class, () -> userService.deleteUser(999L));
//         verify(userRepository, times(1)).existsById(999L);
//         verify(userRepository, never()).deleteById(anyLong());
//     }

//     @Test
//     void toggleUserStatus_WhenUserExists_ShouldToggleStatus() {
//         // Arrange
//         when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
//         when(userRepository.save(any(User.class))).thenReturn(testUser);

//         // Act
//         UserDTO result = userService.toggleUserStatus(1L);

//         // Assert
//         assertNotNull(result);
//         verify(userRepository, times(1)).findById(1L);
//         verify(userRepository, times(1)).save(any(User.class));
//     }

//     @Test
//     void toggleUserStatus_WhenUserNotFound_ShouldThrowException() {
//         // Arrange
//         when(userRepository.findById(999L)).thenReturn(Optional.empty());

//         // Act & Assert
//         assertThrows(UserNotFoundException.class, () -> userService.toggleUserStatus(999L));
//         verify(userRepository, times(1)).findById(999L);
//         verify(userRepository, never()).save(any(User.class));
//     }
// }

