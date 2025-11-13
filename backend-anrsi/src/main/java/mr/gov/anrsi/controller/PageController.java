package mr.gov.anrsi.controller;

import mr.gov.anrsi.dto.PageCreateDTO;
import mr.gov.anrsi.dto.PageDTO;
import mr.gov.anrsi.dto.PageUpdateDTO;
import mr.gov.anrsi.entity.Page;
import mr.gov.anrsi.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/pages")
@ConditionalOnProperty(name = "spring.datasource.url")
public class PageController {
    
    @Autowired
    private PageService pageService;
    
    /**
     * Public endpoint: Get published page by slug
     */
    @GetMapping("/{slug}")
    public ResponseEntity<PageDTO> getPageBySlug(@PathVariable String slug) {
        PageDTO page = pageService.getPageBySlug(slug);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Public endpoint: Get all published pages
     */
    @GetMapping
    public ResponseEntity<List<PageDTO>> getAllPublishedPages() {
        List<PageDTO> pages = pageService.getAllPublishedPages();
        return ResponseEntity.ok(pages);
    }
    
    /**
     * Admin endpoint: Get all pages (including unpublished)
     * Note: Access control is handled by SecurityConfig which permits all /api/pages/** endpoints
     */
    @GetMapping("/admin/all")
    public ResponseEntity<List<PageDTO>> getAllPages() {
        List<PageDTO> pages = pageService.getAllPages();
        return ResponseEntity.ok(pages);
    }
    
    /**
     * Admin endpoint: Get page by ID (including unpublished)
     * Note: Access control is handled by SecurityConfig which permits all /api/pages/** endpoints
     */
    @GetMapping("/admin/{id}")
    public ResponseEntity<PageDTO> getPageById(@PathVariable Long id) {
        PageDTO page = pageService.getPageById(id);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Admin endpoint: Get page by slug (including unpublished)
     * Note: Access control is handled by SecurityConfig which permits all /api/pages/** endpoints
     */
    @GetMapping("/admin/slug/{slug}")
    public ResponseEntity<PageDTO> getPageBySlugForAdmin(@PathVariable String slug) {
        PageDTO page = pageService.getPageBySlugForAdmin(slug);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Admin endpoint: Create new page
     * Note: Access control is handled by SecurityConfig which permits all /api/pages/** endpoints
     */
    @PostMapping
    public ResponseEntity<PageDTO> createPage(@Valid @RequestBody PageCreateDTO dto) {
        PageDTO page = pageService.createPage(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(page);
    }
    
    /**
     * Admin endpoint: Update page
     * Note: Access control is handled by SecurityConfig which permits all /api/pages/** endpoints
     */
    @PutMapping("/{id}")
    public ResponseEntity<PageDTO> updatePage(@PathVariable Long id, @Valid @RequestBody PageUpdateDTO dto) {
        PageDTO page = pageService.updatePage(id, dto);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Admin endpoint: Delete page
     * Note: Access control is handled by SecurityConfig which permits all /api/pages/** endpoints
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePage(@PathVariable Long id) {
        pageService.deletePage(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Admin endpoint: Publish page
     * Note: Access control is handled by SecurityConfig which permits all /api/pages/** endpoints
     */
    @PutMapping("/{id}/publish")
    public ResponseEntity<PageDTO> publishPage(@PathVariable Long id) {
        PageDTO page = pageService.publishPage(id);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Admin endpoint: Unpublish page
     * Note: Access control is handled by SecurityConfig which permits all /api/pages/** endpoints
     */
    @PutMapping("/{id}/unpublish")
    public ResponseEntity<PageDTO> unpublishPage(@PathVariable Long id) {
        PageDTO page = pageService.unpublishPage(id);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Admin endpoint: Toggle page active status
     * Note: Access control is handled by SecurityConfig which permits all /api/pages/** endpoints
     */
    @PutMapping("/{id}/toggle")
    public ResponseEntity<PageDTO> togglePageStatus(@PathVariable Long id) {
        PageDTO page = pageService.togglePageStatus(id);
        return ResponseEntity.ok(page);
    }
    
    /**
     * Admin endpoint: Get all page slugs
     * Note: Access control is handled by SecurityConfig which permits all /api/pages/** endpoints
     */
    @GetMapping("/admin/slugs")
    public ResponseEntity<List<String>> getAllSlugs() {
        List<String> slugs = pageService.getAllSlugs();
        return ResponseEntity.ok(slugs);
    }
    
    /**
     * Admin endpoint: Get available page types
     * Note: Access control is handled by SecurityConfig which permits all /api/pages/** endpoints
     */
    @GetMapping("/admin/types")
    public ResponseEntity<List<Page.PageType>> getAvailablePageTypes() {
        List<Page.PageType> types = pageService.getAvailablePageTypes();
        return ResponseEntity.ok(types);
    }
}

