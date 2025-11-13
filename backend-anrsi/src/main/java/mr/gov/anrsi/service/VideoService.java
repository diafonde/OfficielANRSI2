package mr.gov.anrsi.service;

import mr.gov.anrsi.dto.VideoCreateDTO;
import mr.gov.anrsi.dto.VideoDTO;
import mr.gov.anrsi.entity.Video;
import mr.gov.anrsi.exception.VideoNotFoundException;
import mr.gov.anrsi.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@ConditionalOnProperty(name = "spring.datasource.url")
public class VideoService {
    
    @Autowired
    private VideoRepository videoRepository;
    
    public List<VideoDTO> getAllVideos() {
        return videoRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public VideoDTO getVideoById(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new VideoNotFoundException("Video not found with id: " + id));
        return convertToDTO(video);
    }
    
    public VideoDTO createVideo(VideoCreateDTO dto) {
        Video video = convertToEntity(dto);
        Video saved = videoRepository.save(video);
        return convertToDTO(saved);
    }
    
    public VideoDTO updateVideo(Long id, VideoCreateDTO dto) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new VideoNotFoundException("Video not found with id: " + id));
        
        video.setTitle(dto.getTitle());
        video.setUrl(dto.getUrl());
        video.setType(dto.getType());
        video.setDescription(dto.getDescription());
        video.setThumbnailUrl(dto.getThumbnailUrl());
        
        Video updated = videoRepository.save(video);
        return convertToDTO(updated);
    }
    
    public void deleteVideo(Long id) {
        if (!videoRepository.existsById(id)) {
            throw new VideoNotFoundException("Video not found with id: " + id);
        }
        videoRepository.deleteById(id);
    }
    
    private VideoDTO convertToDTO(Video video) {
        VideoDTO dto = new VideoDTO();
        dto.setId(video.getId());
        dto.setTitle(video.getTitle());
        dto.setUrl(video.getUrl());
        dto.setType(video.getType());
        dto.setDescription(video.getDescription());
        dto.setThumbnailUrl(video.getThumbnailUrl());
        dto.setCreatedAt(video.getCreatedAt());
        dto.setUpdatedAt(video.getUpdatedAt());
        return dto;
    }
    
    private Video convertToEntity(VideoCreateDTO dto) {
        Video video = new Video();
        video.setTitle(dto.getTitle());
        video.setUrl(dto.getUrl());
        video.setType(dto.getType() != null ? dto.getType() : "youtube");
        video.setDescription(dto.getDescription());
        video.setThumbnailUrl(dto.getThumbnailUrl());
        return video;
    }
}

