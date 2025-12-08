// package mr.gov.anrsi.controller;

// import com.fasterxml.jackson.databind.ObjectMapper;
// import mr.gov.anrsi.dto.ArticleCreateDTO;
// import mr.gov.anrsi.dto.ArticleDTO;
// import mr.gov.anrsi.service.ArticleService;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.http.MediaType;
// import org.springframework.security.test.context.support.WithMockUser;
// import org.springframework.test.context.ActiveProfiles;
// import org.springframework.test.web.servlet.MockMvc;

// import java.time.LocalDateTime;
// import java.util.Arrays;
// import java.util.List;

// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.ArgumentMatchers.eq;
// import static org.mockito.Mockito.*;
// import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// @SpringBootTest
// @AutoConfigureMockMvc
// @ActiveProfiles("test")
// class ArticleControllerTest {

//     @Autowired
//     private MockMvc mockMvc;

//     @MockBean
//     private ArticleService articleService;

//     @Autowired
//     private ObjectMapper objectMapper;

//     private ArticleDTO testArticleDTO;
//     private ArticleCreateDTO testArticleCreateDTO;

//     @BeforeEach
//     void setUp() {
//         testArticleDTO = new ArticleDTO();
//         testArticleDTO.setId(1L);
//         testArticleDTO.setTitle("Test Article");
//         testArticleDTO.setContent("Test content");
//         testArticleDTO.setExcerpt("Test excerpt");
//         testArticleDTO.setAuthor("Test Author");
//         testArticleDTO.setPublishDate(LocalDateTime.now());
//         testArticleDTO.setCategory("Technology");
//         testArticleDTO.setPublished(true);
//         testArticleDTO.setFeatured(true);

//         testArticleCreateDTO = new ArticleCreateDTO();
//         testArticleCreateDTO.setTitle("New Article");
//         testArticleCreateDTO.setContent("This is a new article content that is long enough to meet validation requirements.");
//         testArticleCreateDTO.setExcerpt("This is a new article excerpt that is long enough.");
//         testArticleCreateDTO.setAuthor("New Author");
//         testArticleCreateDTO.setPublishDate(LocalDateTime.now());
//         testArticleCreateDTO.setCategory("Science");
//         testArticleCreateDTO.setPublished(true);
//         testArticleCreateDTO.setFeatured(false);
//     }

//     @Test
//     void getAllArticles_ShouldReturnPublishedArticles() throws Exception {
//         // Arrange
//         List<ArticleDTO> articles = Arrays.asList(testArticleDTO);
//         when(articleService.getPublishedArticles()).thenReturn(articles);

//         // Act & Assert
//         mockMvc.perform(get("/api/articles"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$").isArray())
//                 .andExpect(jsonPath("$[0].title").value("Test Article"));

//         verify(articleService, times(1)).getPublishedArticles();
//     }

//     @Test
//     @WithMockUser(roles = {"ADMIN"})
//     void getAllArticlesAdmin_ShouldReturnAllArticles() throws Exception {
//         // Arrange
//         List<ArticleDTO> articles = Arrays.asList(testArticleDTO);
//         when(articleService.getAllArticles()).thenReturn(articles);

//         // Act & Assert
//         mockMvc.perform(get("/api/articles/admin/all"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$").isArray());

//         verify(articleService, times(1)).getAllArticles();
//     }

//     @Test
//     void getArticleById_WhenPublished_ShouldReturnArticle() throws Exception {
//         // Arrange
//         when(articleService.getArticleById(1L)).thenReturn(testArticleDTO);

//         // Act & Assert
//         mockMvc.perform(get("/api/articles/1"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.id").value(1))
//                 .andExpect(jsonPath("$.title").value("Test Article"));

//         verify(articleService, times(1)).getArticleById(1L);
//     }

//     @Test
//     void getArticleById_WhenUnpublished_ShouldReturnNotFound() throws Exception {
//         // Arrange
//         testArticleDTO.setPublished(false);
//         when(articleService.getArticleById(1L)).thenReturn(testArticleDTO);

//         // Act & Assert
//         mockMvc.perform(get("/api/articles/1"))
//                 .andExpect(status().isNotFound());

//         verify(articleService, times(1)).getArticleById(1L);
//     }

//     @Test
//     void getFeaturedArticles_ShouldReturnFeaturedArticles() throws Exception {
//         // Arrange
//         List<ArticleDTO> articles = Arrays.asList(testArticleDTO);
//         when(articleService.getFeaturedArticles()).thenReturn(articles);

//         // Act & Assert
//         mockMvc.perform(get("/api/articles/featured"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$").isArray());

//         verify(articleService, times(1)).getFeaturedArticles();
//     }

//     @Test
//     void getRecentArticles_ShouldReturnRecentArticles() throws Exception {
//         // Arrange
//         List<ArticleDTO> articles = Arrays.asList(testArticleDTO);
//         when(articleService.getRecentArticles()).thenReturn(articles);

//         // Act & Assert
//         mockMvc.perform(get("/api/articles/recent"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$").isArray());

//         verify(articleService, times(1)).getRecentArticles();
//     }

//     @Test
//     void searchArticles_ShouldReturnMatchingArticles() throws Exception {
//         // Arrange
//         List<ArticleDTO> articles = Arrays.asList(testArticleDTO);
//         when(articleService.searchArticles("test")).thenReturn(articles);

//         // Act & Assert
//         mockMvc.perform(get("/api/articles/search").param("q", "test"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$").isArray());

//         verify(articleService, times(1)).searchArticles("test");
//     }

//     @Test
//     void getArticlesByCategory_ShouldReturnCategoryArticles() throws Exception {
//         // Arrange
//         List<ArticleDTO> articles = Arrays.asList(testArticleDTO);
//         when(articleService.getArticlesByCategory("Technology")).thenReturn(articles);

//         // Act & Assert
//         mockMvc.perform(get("/api/articles/category/Technology"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$").isArray());

//         verify(articleService, times(1)).getArticlesByCategory("Technology");
//     }

//     @Test
//     @WithMockUser(roles = {"ADMIN"})
//     void createArticle_AsAdmin_ShouldCreateArticle() throws Exception {
//         // Arrange
//         when(articleService.createArticle(any(ArticleCreateDTO.class))).thenReturn(testArticleDTO);

//         // Act & Assert
//         mockMvc.perform(post("/api/articles")
//                         .with(csrf())
//                         .contentType(MediaType.APPLICATION_JSON)
//                         .content(objectMapper.writeValueAsString(testArticleCreateDTO)))
//                 .andExpect(status().isCreated())
//                 .andExpect(jsonPath("$.title").value("Test Article"));

//         verify(articleService, times(1)).createArticle(any(ArticleCreateDTO.class));
//     }

//     @Test
//     @WithMockUser(roles = {"EDITOR"})
//     void createArticle_AsEditor_ShouldCreateArticle() throws Exception {
//         // Arrange
//         when(articleService.createArticle(any(ArticleCreateDTO.class))).thenReturn(testArticleDTO);

//         // Act & Assert
//         mockMvc.perform(post("/api/articles")
//                         .with(csrf())
//                         .contentType(MediaType.APPLICATION_JSON)
//                         .content(objectMapper.writeValueAsString(testArticleCreateDTO)))
//                 .andExpect(status().isCreated());

//         verify(articleService, times(1)).createArticle(any(ArticleCreateDTO.class));
//     }

//     @Test
//     @WithMockUser(roles = {"VIEWER"})
//     void createArticle_AsViewer_ShouldAllowAccess() throws Exception {
//         // Note: Security is disabled in the application, so all requests are allowed
//         // Arrange
//         when(articleService.createArticle(any(ArticleCreateDTO.class))).thenReturn(testArticleDTO);

//         // Act & Assert
//         mockMvc.perform(post("/api/articles")
//                         .with(csrf())
//                         .contentType(MediaType.APPLICATION_JSON)
//                         .content(objectMapper.writeValueAsString(testArticleCreateDTO)))
//                 .andExpect(status().isCreated());

//         verify(articleService, times(1)).createArticle(any(ArticleCreateDTO.class));
//     }

//     @Test
//     @WithMockUser(roles = {"ADMIN"})
//     void updateArticle_AsAdmin_ShouldUpdateArticle() throws Exception {
//         // Arrange
//         when(articleService.updateArticle(eq(1L), any(ArticleCreateDTO.class))).thenReturn(testArticleDTO);

//         // Act & Assert
//         mockMvc.perform(put("/api/articles/1")
//                         .with(csrf())
//                         .contentType(MediaType.APPLICATION_JSON)
//                         .content(objectMapper.writeValueAsString(testArticleCreateDTO)))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.title").value("Test Article"));

//         verify(articleService, times(1)).updateArticle(eq(1L), any(ArticleCreateDTO.class));
//     }

//     @Test
//     @WithMockUser(roles = {"ADMIN"})
//     void deleteArticle_AsAdmin_ShouldDeleteArticle() throws Exception {
//         // Arrange
//         doNothing().when(articleService).deleteArticle(1L);

//         // Act & Assert
//         mockMvc.perform(delete("/api/articles/1")
//                         .with(csrf()))
//                 .andExpect(status().isNoContent());

//         verify(articleService, times(1)).deleteArticle(1L);
//     }

//     @Test
//     @WithMockUser(roles = {"EDITOR"})
//     void deleteArticle_AsEditor_ShouldAllowAccess() throws Exception {
//         // Note: Security is disabled in the application, so all requests are allowed
//         // Arrange
//         doNothing().when(articleService).deleteArticle(1L);

//         // Act & Assert
//         mockMvc.perform(delete("/api/articles/1")
//                         .with(csrf()))
//                 .andExpect(status().isNoContent());

//         verify(articleService, times(1)).deleteArticle(1L);
//     }
// }

