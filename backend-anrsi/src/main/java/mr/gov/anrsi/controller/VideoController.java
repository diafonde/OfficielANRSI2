package mr.gov.anrsi.controller;

import jakarta.validation.Valid;
import mr.gov.anrsi.dto.VideoCreateDTO;
import mr.gov.anrsi.dto.VideoDTO;
import mr.gov.anrsi.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
@ConditionalOnProperty(name = "spring.datasource.url")
public class VideoController {
    
    @Autowired
    private VideoService videoService;
    
    @GetMapping
    public ResponseEntity<List<VideoDTO>> getAllVideos() {
        return ResponseEntity.ok(videoService.getAllVideos());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VideoDTO> getVideoById(@PathVariable Long id) {
        return ResponseEntity.ok(videoService.getVideoById(id));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<VideoDTO> createVideo(@Valid @RequestBody VideoCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(videoService.createVideo(dto));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<VideoDTO> updateVideo(@PathVariable Long id, @Valid @RequestBody VideoCreateDTO dto) {
        return ResponseEntity.ok(videoService.updateVideo(id, dto));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        videoService.deleteVideo(id);
        return ResponseEntity.noContent().build();
    }
}

