// package mr.gov.anrsi.service;

// import mr.gov.anrsi.dto.PageCreateDTO;
// import mr.gov.anrsi.dto.PageDTO;
// import mr.gov.anrsi.dto.PageUpdateDTO;
// import mr.gov.anrsi.entity.Page;
// import mr.gov.anrsi.exception.PageNotFoundException;
// import mr.gov.anrsi.repository.PageRepository;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;

// import java.time.LocalDateTime;
// import java.util.Arrays;
// import java.util.List;
// import java.util.Optional;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.*;

// @ExtendWith(MockitoExtension.class)
// class PageServiceTest {

//     @Mock
//     private PageRepository pageRepository;

//     @InjectMocks
//     private PageService pageService;

//     private Page testPage;
//     private PageCreateDTO testPageCreateDTO;

//     @BeforeEach
//     void setUp() {
//         testPage = new Page();
//         testPage.setId(1L);
//         testPage.setSlug("test-page");
//         testPage.setTitle("Test Page");
//         testPage.setHeroTitle("Hero Title");
//         testPage.setHeroSubtitle("Hero Subtitle");
//         testPage.setContent("{\"content\": \"test\"}");
//         testPage.setPageType(Page.PageType.SIMPLE);
//         testPage.setIsPublished(true);
//         testPage.setIsActive(true);
//         testPage.setCreatedAt(LocalDateTime.now());
//         testPage.setUpdatedAt(LocalDateTime.now());

//         testPageCreateDTO = new PageCreateDTO();
//         testPageCreateDTO.setSlug("new-page");
//         testPageCreateDTO.setTitle("New Page");
//         testPageCreateDTO.setHeroTitle("New Hero Title");
//         testPageCreateDTO.setContent("{\"content\": \"new\"}");
//         testPageCreateDTO.setPageType(Page.PageType.SIMPLE);
//         testPageCreateDTO.setIsPublished(false);
//         testPageCreateDTO.setIsActive(true);
//     }

//     @Test
//     void getPageBySlug_WhenPublished_ShouldReturnPage() {
//         // Arrange
//         when(pageRepository.findBySlugAndIsPublishedTrue("test-page")).thenReturn(Optional.of(testPage));

//         // Act
//         PageDTO result = pageService.getPageBySlug("test-page");

//         // Assert
//         assertNotNull(result);
//         assertEquals("test-page", result.getSlug());
//         verify(pageRepository, times(1)).findBySlugAndIsPublishedTrue("test-page");
//     }

//     @Test
//     void getPageBySlug_WhenNotFound_ShouldThrowException() {
//         // Arrange
//         when(pageRepository.findBySlugAndIsPublishedTrue("nonexistent")).thenReturn(Optional.empty());

//         // Act & Assert
//         assertThrows(PageNotFoundException.class, () -> pageService.getPageBySlug("nonexistent"));
//         verify(pageRepository, times(1)).findBySlugAndIsPublishedTrue("nonexistent");
//     }

//     @Test
//     void getPageById_WhenExists_ShouldReturnPage() {
//         // Arrange
//         when(pageRepository.findById(1L)).thenReturn(Optional.of(testPage));

//         // Act
//         PageDTO result = pageService.getPageById(1L);

//         // Assert
//         assertNotNull(result);
//         assertEquals(1L, result.getId());
//         verify(pageRepository, times(1)).findById(1L);
//     }

//     @Test
//     void getAllPublishedPages_ShouldReturnPublishedPages() {
//         // Arrange
//         when(pageRepository.findByIsPublishedTrueAndIsActiveTrue()).thenReturn(Arrays.asList(testPage));

//         // Act
//         List<PageDTO> result = pageService.getAllPublishedPages();

//         // Assert
//         assertNotNull(result);
//         assertEquals(1, result.size());
//         verify(pageRepository, times(1)).findByIsPublishedTrueAndIsActiveTrue();
//     }

//     @Test
//     void createPage_WithValidData_ShouldCreatePage() {
//         // Arrange
//         when(pageRepository.existsBySlug("new-page")).thenReturn(false);
//         when(pageRepository.save(any(Page.class))).thenReturn(testPage);

//         // Act
//         PageDTO result = pageService.createPage(testPageCreateDTO);

//         // Assert
//         assertNotNull(result);
//         verify(pageRepository, times(1)).existsBySlug("new-page");
//         verify(pageRepository, times(1)).save(any(Page.class));
//     }

//     @Test
//     void createPage_WithExistingSlug_ShouldThrowException() {
//         // Arrange
//         when(pageRepository.existsBySlug("existing-slug")).thenReturn(true);
//         testPageCreateDTO.setSlug("existing-slug");

//         // Act & Assert
//         assertThrows(IllegalArgumentException.class, () -> pageService.createPage(testPageCreateDTO));
//         verify(pageRepository, times(1)).existsBySlug("existing-slug");
//         verify(pageRepository, never()).save(any(Page.class));
//     }

//     @Test
//     void updatePage_WhenExists_ShouldUpdatePage() {
//         // Arrange
//         PageUpdateDTO updateDTO = new PageUpdateDTO();
//         updateDTO.setTitle("Updated Title");
//         when(pageRepository.findById(1L)).thenReturn(Optional.of(testPage));
//         when(pageRepository.save(any(Page.class))).thenReturn(testPage);

//         // Act
//         PageDTO result = pageService.updatePage(1L, updateDTO);

//         // Assert
//         assertNotNull(result);
//         verify(pageRepository, times(1)).findById(1L);
//         verify(pageRepository, times(1)).save(any(Page.class));
//     }

//     @Test
//     void deletePage_WhenExists_ShouldDeletePage() {
//         // Arrange
//         when(pageRepository.existsById(1L)).thenReturn(true);

//         // Act
//         pageService.deletePage(1L);

//         // Assert
//         verify(pageRepository, times(1)).existsById(1L);
//         verify(pageRepository, times(1)).deleteById(1L);
//     }

//     @Test
//     void publishPage_WhenExists_ShouldPublishPage() {
//         // Arrange
//         when(pageRepository.findById(1L)).thenReturn(Optional.of(testPage));
//         when(pageRepository.save(any(Page.class))).thenReturn(testPage);

//         // Act
//         PageDTO result = pageService.publishPage(1L);

//         // Assert
//         assertNotNull(result);
//         verify(pageRepository, times(1)).findById(1L);
//         verify(pageRepository, times(1)).save(any(Page.class));
//     }

//     @Test
//     void togglePageStatus_WhenExists_ShouldToggleStatus() {
//         // Arrange
//         when(pageRepository.findById(1L)).thenReturn(Optional.of(testPage));
//         when(pageRepository.save(any(Page.class))).thenReturn(testPage);

//         // Act
//         PageDTO result = pageService.togglePageStatus(1L);

//         // Assert
//         assertNotNull(result);
//         verify(pageRepository, times(1)).findById(1L);
//         verify(pageRepository, times(1)).save(any(Page.class));
//     }
// }




