package mr.gov.anrsi.controller;

import jakarta.validation.Valid;
import mr.gov.anrsi.dto.ContactMessageCreateDTO;
import mr.gov.anrsi.dto.ContactMessageDTO;
import mr.gov.anrsi.service.ContactMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@ConditionalOnProperty(name = "spring.datasource.url")
@CrossOrigin(origins = "*")
public class ContactController {
    
    @Autowired
    private ContactMessageService contactMessageService;
    
    @PostMapping
    public ResponseEntity<ContactMessageDTO> submitContactMessage(@Valid @RequestBody ContactMessageCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactMessageService.createContactMessage(dto));
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<List<ContactMessageDTO>> getAllMessages() {
        return ResponseEntity.ok(contactMessageService.getAllMessages());
    }
    
    @GetMapping("/unread")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<List<ContactMessageDTO>> getUnreadMessages() {
        return ResponseEntity.ok(contactMessageService.getUnreadMessages());
    }
    
    @GetMapping("/unread/count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<Long> getUnreadCount() {
        return ResponseEntity.ok(contactMessageService.getUnreadCount());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<ContactMessageDTO> getMessageById(@PathVariable Long id) {
        return ResponseEntity.ok(contactMessageService.getMessageById(id));
    }
    
    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public ResponseEntity<ContactMessageDTO> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(contactMessageService.markAsRead(id));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        contactMessageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}


