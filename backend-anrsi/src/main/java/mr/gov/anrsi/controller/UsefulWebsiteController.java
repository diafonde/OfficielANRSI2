package mr.gov.anrsi.controller;

import jakarta.validation.Valid;
import mr.gov.anrsi.dto.UsefulWebsiteCreateDTO;
import mr.gov.anrsi.dto.UsefulWebsiteDTO;
import mr.gov.anrsi.service.UsefulWebsiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/useful-websites")
@ConditionalOnProperty(name = "spring.datasource.url")
public class UsefulWebsiteController {
    
    @Autowired
    private UsefulWebsiteService usefulWebsiteService;
    
    @GetMapping
    public ResponseEntity<List<UsefulWebsiteDTO>> getAllWebsites() {
        return ResponseEntity.ok(usefulWebsiteService.getAllWebsites());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UsefulWebsiteDTO> getWebsiteById(@PathVariable Long id) {
        return ResponseEntity.ok(usefulWebsiteService.getWebsiteById(id));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<UsefulWebsiteDTO> createWebsite(@Valid @RequestBody UsefulWebsiteCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usefulWebsiteService.createWebsite(dto));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<UsefulWebsiteDTO> updateWebsite(@PathVariable Long id, @Valid @RequestBody UsefulWebsiteCreateDTO dto) {
        return ResponseEntity.ok(usefulWebsiteService.updateWebsite(id, dto));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteWebsite(@PathVariable Long id) {
        usefulWebsiteService.deleteWebsite(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/reorder")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<Void> reorderWebsites(@RequestBody Map<String, List<Map<String, Object>>> request) {
        List<Map<String, Object>> websites = request.get("websites");
        List<UsefulWebsiteService.ReorderRequest> reorderRequests = websites.stream()
                .map(website -> {
                    UsefulWebsiteService.ReorderRequest req = new UsefulWebsiteService.ReorderRequest();
                    // Handle both Long and Integer IDs
                    Object idObj = website.get("id");
                    if (idObj instanceof Number) {
                        req.setId(((Number) idObj).longValue());
                    }
                    Object orderObj = website.get("order");
                    if (orderObj instanceof Number) {
                        req.setOrder(((Number) orderObj).intValue());
                    }
                    return req;
                })
                .collect(java.util.stream.Collectors.toList());
        
        usefulWebsiteService.reorderWebsitesByIds(reorderRequests);
        return ResponseEntity.ok().build();
    }
}



