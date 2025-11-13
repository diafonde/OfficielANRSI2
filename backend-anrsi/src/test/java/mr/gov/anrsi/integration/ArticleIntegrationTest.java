package mr.gov.anrsi.integration;

import mr.gov.anrsi.dto.ArticleCreateDTO;
import mr.gov.anrsi.dto.ArticleDTO;
import mr.gov.anrsi.repository.ArticleRepository;
import mr.gov.anrsi.service.ArticleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ArticleIntegrationTest {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ArticleService articleService;

    @BeforeEach
    void setUp() {
        articleRepository.deleteAll();
    }

    @Test
    void createAndRetrieveArticle_ShouldWork() {
        // Arrange
        ArticleCreateDTO createDTO = new ArticleCreateDTO();
        createDTO.setTitle("Integration Test Article");
        createDTO.setContent("This is a comprehensive integration test article content that is long enough to meet validation requirements.");
        createDTO.setExcerpt("This is a comprehensive integration test excerpt that is long enough.");
        createDTO.setAuthor("Test Author");
        createDTO.setPublishDate(LocalDateTime.now());
        createDTO.setCategory("Technology");
        createDTO.setFeatured(true);
        createDTO.setPublished(true);

        // Act
        ArticleDTO created = articleService.createArticle(createDTO);
        ArticleDTO retrieved = articleService.getArticleById(created.getId());

        // Assert
        assertNotNull(created);
        assertNotNull(retrieved);
        assertEquals(createDTO.getTitle(), retrieved.getTitle());
        assertEquals(createDTO.getCategory(), retrieved.getCategory());
        assertTrue(retrieved.getFeatured());
        assertTrue(retrieved.getPublished());
    }

    @Test
    void updateArticle_ShouldUpdateCorrectly() {
        // Arrange
        ArticleCreateDTO createDTO = new ArticleCreateDTO();
        createDTO.setTitle("Original Title");
        createDTO.setContent("This is the original content that is long enough to meet validation requirements.");
        createDTO.setExcerpt("This is the original excerpt that is long enough.");
        createDTO.setAuthor("Test Author");
        createDTO.setPublishDate(LocalDateTime.now());
        createDTO.setCategory("Technology");
        createDTO.setPublished(true);

        ArticleDTO created = articleService.createArticle(createDTO);

        // Update
        createDTO.setTitle("Updated Title");
        createDTO.setCategory("Science");

        // Act
        ArticleDTO updated = articleService.updateArticle(created.getId(), createDTO);

        // Assert
        assertEquals("Updated Title", updated.getTitle());
        assertEquals("Science", updated.getCategory());
    }

    @Test
    void getPublishedArticles_ShouldReturnOnlyPublished() {
        // Arrange
        ArticleCreateDTO publishedDTO = new ArticleCreateDTO();
        publishedDTO.setTitle("Published Article");
        publishedDTO.setContent("This is a published article content that is long enough to meet validation requirements.");
        publishedDTO.setExcerpt("This is a published article excerpt that is long enough.");
        publishedDTO.setAuthor("Author");
        publishedDTO.setPublishDate(LocalDateTime.now());
        publishedDTO.setCategory("Tech");
        publishedDTO.setPublished(true);

        ArticleCreateDTO draftDTO = new ArticleCreateDTO();
        draftDTO.setTitle("Draft Article");
        draftDTO.setContent("This is a draft article content that is long enough to meet validation requirements.");
        draftDTO.setExcerpt("This is a draft article excerpt that is long enough.");
        draftDTO.setAuthor("Author");
        draftDTO.setPublishDate(LocalDateTime.now());
        draftDTO.setCategory("Tech");
        draftDTO.setPublished(false);

        articleService.createArticle(publishedDTO);
        articleService.createArticle(draftDTO);

        // Act
        List<ArticleDTO> published = articleService.getPublishedArticles();

        // Assert
        assertEquals(1, published.size());
        assertTrue(published.get(0).getPublished());
    }

    @Test
    void searchArticles_ShouldFindMatchingArticles() {
        // Arrange
        ArticleCreateDTO dto1 = new ArticleCreateDTO();
        dto1.setTitle("Java Programming");
        dto1.setContent("This article is about Java programming and its features.");
        dto1.setExcerpt("This article is about Java programming.");
        dto1.setAuthor("Author");
        dto1.setPublishDate(LocalDateTime.now());
        dto1.setCategory("Tech");
        dto1.setPublished(true);

        ArticleCreateDTO dto2 = new ArticleCreateDTO();
        dto2.setTitle("Python Tutorial");
        dto2.setContent("This article is about Python programming language.");
        dto2.setExcerpt("This article is about Python programming.");
        dto2.setAuthor("Author");
        dto2.setPublishDate(LocalDateTime.now());
        dto2.setCategory("Tech");
        dto2.setPublished(true);

        articleService.createArticle(dto1);
        articleService.createArticle(dto2);

        // Act
        List<ArticleDTO> javaResults = articleService.searchArticles("Java");
        List<ArticleDTO> pythonResults = articleService.searchArticles("Python");

        // Assert
        assertEquals(1, javaResults.size());
        assertTrue(javaResults.get(0).getTitle().contains("Java"));
        assertEquals(1, pythonResults.size());
        assertTrue(pythonResults.get(0).getTitle().contains("Python"));
    }
}

