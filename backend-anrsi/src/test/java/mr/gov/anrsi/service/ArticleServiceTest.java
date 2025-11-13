package mr.gov.anrsi.service;

import mr.gov.anrsi.dto.ArticleCreateDTO;
import mr.gov.anrsi.dto.ArticleDTO;
import mr.gov.anrsi.entity.Article;
import mr.gov.anrsi.exception.ArticleNotFoundException;
import mr.gov.anrsi.repository.ArticleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ArticleServiceTest {

    @Mock
    private ArticleRepository articleRepository;

    @InjectMocks
    private ArticleService articleService;

    private Article testArticle;
    private ArticleCreateDTO testArticleCreateDTO;

    @BeforeEach
    void setUp() {
        testArticle = new Article();
        testArticle.setId(1L);
        testArticle.setTitle("Test Article");
        testArticle.setContent("This is a test article content that is long enough to meet validation requirements.");
        testArticle.setExcerpt("This is a test excerpt that is long enough.");
        testArticle.setAuthor("Test Author");
        testArticle.setPublishDate(LocalDateTime.now());
        testArticle.setCategory("Technology");
        testArticle.setFeatured(true);
        testArticle.setPublished(true);
        testArticle.setCreatedAt(LocalDateTime.now());
        testArticle.setUpdatedAt(LocalDateTime.now());

        testArticleCreateDTO = new ArticleCreateDTO();
        testArticleCreateDTO.setTitle("New Test Article");
        testArticleCreateDTO.setContent("This is a new test article content that is long enough to meet validation requirements.");
        testArticleCreateDTO.setExcerpt("This is a new test excerpt that is long enough.");
        testArticleCreateDTO.setAuthor("New Test Author");
        testArticleCreateDTO.setPublishDate(LocalDateTime.now());
        testArticleCreateDTO.setCategory("Science");
        testArticleCreateDTO.setFeatured(false);
        testArticleCreateDTO.setPublished(true);
    }

    @Test
    void getAllArticles_ShouldReturnAllArticles() {
        // Arrange
        Article article2 = new Article();
        article2.setId(2L);
        article2.setTitle("Second Article");
        article2.setContent("Content");
        article2.setExcerpt("Excerpt");
        article2.setAuthor("Author");
        article2.setPublishDate(LocalDateTime.now());
        article2.setCategory("Category");
        article2.setPublished(true);

        when(articleRepository.findAllByOrderByPublishDateDesc()).thenReturn(Arrays.asList(testArticle, article2));

        // Act
        List<ArticleDTO> result = articleService.getAllArticles();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(articleRepository, times(1)).findAllByOrderByPublishDateDesc();
    }

    @Test
    void getPublishedArticles_ShouldReturnOnlyPublishedArticles() {
        // Arrange
        Article unpublishedArticle = new Article();
        unpublishedArticle.setId(2L);
        unpublishedArticle.setTitle("Unpublished");
        unpublishedArticle.setContent("Content");
        unpublishedArticle.setExcerpt("Excerpt");
        unpublishedArticle.setAuthor("Author");
        unpublishedArticle.setPublishDate(LocalDateTime.now());
        unpublishedArticle.setCategory("Category");
        unpublishedArticle.setPublished(false);

        when(articleRepository.findByPublishedTrue()).thenReturn(Arrays.asList(testArticle));

        // Act
        List<ArticleDTO> result = articleService.getPublishedArticles();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getPublished());
        verify(articleRepository, times(1)).findByPublishedTrue();
    }

    @Test
    void getArticleById_WhenArticleExists_ShouldReturnArticle() {
        // Arrange
        when(articleRepository.findById(1L)).thenReturn(Optional.of(testArticle));

        // Act
        ArticleDTO result = articleService.getArticleById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Article", result.getTitle());
        verify(articleRepository, times(1)).findById(1L);
    }

    @Test
    void getArticleById_WhenArticleNotFound_ShouldThrowException() {
        // Arrange
        when(articleRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ArticleNotFoundException.class, () -> articleService.getArticleById(999L));
        verify(articleRepository, times(1)).findById(999L);
    }

    @Test
    void getFeaturedArticles_ShouldReturnOnlyFeaturedAndPublishedArticles() {
        // Arrange
        when(articleRepository.findByFeaturedTrue()).thenReturn(Arrays.asList(testArticle));

        // Act
        List<ArticleDTO> result = articleService.getFeaturedArticles();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getFeatured());
        assertTrue(result.get(0).getPublished());
        verify(articleRepository, times(1)).findByFeaturedTrue();
    }

    @Test
    void getRecentArticles_ShouldReturnRecentPublishedArticles() {
        // Arrange
        when(articleRepository.findByPublishDateBeforeOrderByPublishDateDesc(any(LocalDateTime.class)))
                .thenReturn(Arrays.asList(testArticle));

        // Act
        List<ArticleDTO> result = articleService.getRecentArticles();

        // Assert
        assertNotNull(result);
        assertTrue(result.size() <= 10);
        verify(articleRepository, times(1)).findByPublishDateBeforeOrderByPublishDateDesc(any(LocalDateTime.class));
    }

    @Test
    void searchArticles_ShouldReturnMatchingArticles() {
        // Arrange
        when(articleRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase("test", "test"))
                .thenReturn(Arrays.asList(testArticle));

        // Act
        List<ArticleDTO> result = articleService.searchArticles("test");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(articleRepository, times(1))
                .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase("test", "test");
    }

    @Test
    void getArticlesByCategory_ShouldReturnArticlesInCategory() {
        // Arrange
        when(articleRepository.findByCategory("Technology")).thenReturn(Arrays.asList(testArticle));

        // Act
        List<ArticleDTO> result = articleService.getArticlesByCategory("Technology");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Technology", result.get(0).getCategory());
        verify(articleRepository, times(1)).findByCategory("Technology");
    }

    @Test
    void createArticle_ShouldSaveAndReturnArticle() {
        // Arrange
        Article savedArticle = new Article();
        savedArticle.setId(2L);
        savedArticle.setTitle(testArticleCreateDTO.getTitle());
        savedArticle.setContent(testArticleCreateDTO.getContent());
        savedArticle.setExcerpt(testArticleCreateDTO.getExcerpt());
        savedArticle.setAuthor(testArticleCreateDTO.getAuthor());
        savedArticle.setPublishDate(testArticleCreateDTO.getPublishDate());
        savedArticle.setCategory(testArticleCreateDTO.getCategory());
        savedArticle.setFeatured(testArticleCreateDTO.getFeatured());
        savedArticle.setPublished(testArticleCreateDTO.getPublished());
        savedArticle.setCreatedAt(LocalDateTime.now());
        savedArticle.setUpdatedAt(LocalDateTime.now());

        when(articleRepository.save(any(Article.class))).thenReturn(savedArticle);

        // Act
        ArticleDTO result = articleService.createArticle(testArticleCreateDTO);

        // Assert
        assertNotNull(result);
        assertEquals(testArticleCreateDTO.getTitle(), result.getTitle());
        verify(articleRepository, times(1)).save(any(Article.class));
    }

    @Test
    void updateArticle_WhenArticleExists_ShouldUpdateAndReturnArticle() {
        // Arrange
        when(articleRepository.findById(1L)).thenReturn(Optional.of(testArticle));
        when(articleRepository.save(any(Article.class))).thenReturn(testArticle);

        // Act
        ArticleDTO result = articleService.updateArticle(1L, testArticleCreateDTO);

        // Assert
        assertNotNull(result);
        verify(articleRepository, times(1)).findById(1L);
        verify(articleRepository, times(1)).save(any(Article.class));
    }

    @Test
    void updateArticle_WhenArticleNotFound_ShouldThrowException() {
        // Arrange
        when(articleRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ArticleNotFoundException.class, () -> articleService.updateArticle(999L, testArticleCreateDTO));
        verify(articleRepository, times(1)).findById(999L);
        verify(articleRepository, never()).save(any(Article.class));
    }

    @Test
    void deleteArticle_WhenArticleExists_ShouldDeleteArticle() {
        // Arrange
        when(articleRepository.existsById(1L)).thenReturn(true);

        // Act
        articleService.deleteArticle(1L);

        // Assert
        verify(articleRepository, times(1)).existsById(1L);
        verify(articleRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteArticle_WhenArticleNotFound_ShouldThrowException() {
        // Arrange
        when(articleRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThrows(ArticleNotFoundException.class, () -> articleService.deleteArticle(999L));
        verify(articleRepository, times(1)).existsById(999L);
        verify(articleRepository, never()).deleteById(anyLong());
    }
}

