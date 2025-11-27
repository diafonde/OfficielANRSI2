package mr.gov.anrsi.service;

import mr.gov.anrsi.dto.ContactMessageCreateDTO;
import mr.gov.anrsi.dto.ContactMessageDTO;
import mr.gov.anrsi.entity.ContactMessage;
import mr.gov.anrsi.exception.ArticleNotFoundException;
import mr.gov.anrsi.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@ConditionalOnProperty(name = "spring.datasource.url")
public class ContactMessageService {
    
    @Autowired
    private ContactMessageRepository contactMessageRepository;
    
    public ContactMessageDTO createContactMessage(ContactMessageCreateDTO dto) {
        if (!Boolean.TRUE.equals(dto.getConsent())) {
            throw new IllegalArgumentException("Consent is required to submit a contact message");
        }
        
        ContactMessage message = new ContactMessage();
        message.setName(dto.getName());
        message.setEmail(dto.getEmail());
        message.setSubject(dto.getSubject());
        message.setMessage(dto.getMessage());
        message.setIsRead(false);
        
        ContactMessage saved = contactMessageRepository.save(message);
        return convertToDTO(saved);
    }
    
    public List<ContactMessageDTO> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ContactMessageDTO> getUnreadMessages() {
        return contactMessageRepository.findByIsReadFalseOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ContactMessageDTO getMessageById(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ArticleNotFoundException("Contact message not found with id: " + id));
        return convertToDTO(message);
    }
    
    public ContactMessageDTO markAsRead(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ArticleNotFoundException("Contact message not found with id: " + id));
        message.setIsRead(true);
        ContactMessage updated = contactMessageRepository.save(message);
        return convertToDTO(updated);
    }
    
    public void deleteMessage(Long id) {
        if (!contactMessageRepository.existsById(id)) {
            throw new ArticleNotFoundException("Contact message not found with id: " + id);
        }
        contactMessageRepository.deleteById(id);
    }
    
    public Long getUnreadCount() {
        return contactMessageRepository.countByIsReadFalse();
    }
    
    private ContactMessageDTO convertToDTO(ContactMessage message) {
        ContactMessageDTO dto = new ContactMessageDTO();
        dto.setId(message.getId());
        dto.setName(message.getName());
        dto.setEmail(message.getEmail());
        dto.setSubject(message.getSubject());
        dto.setMessage(message.getMessage());
        dto.setIsRead(message.getIsRead());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }
}


