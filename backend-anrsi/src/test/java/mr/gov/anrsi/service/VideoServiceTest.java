package mr.gov.anrsi.service;

import mr.gov.anrsi.dto.VideoCreateDTO;
import mr.gov.anrsi.dto.VideoDTO;
import mr.gov.anrsi.entity.Video;
import mr.gov.anrsi.exception.VideoNotFoundException;
import mr.gov.anrsi.repository.VideoRepository;
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
class VideoServiceTest {

    @Mock
    private VideoRepository videoRepository;

    @InjectMocks
    private VideoService videoService;

    private Video testVideo;
    private VideoCreateDTO testVideoCreateDTO;

    @BeforeEach
    void setUp() {
        testVideo = new Video();
        testVideo.setId(1L);
        testVideo.setTitle("Test Video");
        testVideo.setUrl("https://youtube.com/watch?v=test");
        testVideo.setType("youtube");
        testVideo.setDescription("Test video description");
        testVideo.setThumbnailUrl("https://example.com/thumbnail.jpg");
        testVideo.setCreatedAt(LocalDateTime.now());
        testVideo.setUpdatedAt(LocalDateTime.now());

        testVideoCreateDTO = new VideoCreateDTO();
        testVideoCreateDTO.setTitle("New Video");
        testVideoCreateDTO.setUrl("https://youtube.com/watch?v=new");
        testVideoCreateDTO.setType("youtube");
        testVideoCreateDTO.setDescription("New video description");
        testVideoCreateDTO.setThumbnailUrl("https://example.com/new-thumbnail.jpg");
    }

    @Test
    void getAllVideos_ShouldReturnAllVideos() {
        // Arrange
        Video video2 = new Video();
        video2.setId(2L);
        video2.setTitle("Second Video");
        video2.setUrl("https://example.com/video2");
        video2.setType("file");
        when(videoRepository.findAllByOrderByCreatedAtDesc()).thenReturn(Arrays.asList(testVideo, video2));

        // Act
        List<VideoDTO> result = videoService.getAllVideos();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(videoRepository, times(1)).findAllByOrderByCreatedAtDesc();
    }

    @Test
    void getVideoById_WhenVideoExists_ShouldReturnVideo() {
        // Arrange
        when(videoRepository.findById(1L)).thenReturn(Optional.of(testVideo));

        // Act
        VideoDTO result = videoService.getVideoById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Video", result.getTitle());
        verify(videoRepository, times(1)).findById(1L);
    }

    @Test
    void getVideoById_WhenVideoNotFound_ShouldThrowException() {
        // Arrange
        when(videoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(VideoNotFoundException.class, () -> videoService.getVideoById(999L));
        verify(videoRepository, times(1)).findById(999L);
    }

    @Test
    void createVideo_ShouldSaveAndReturnVideo() {
        // Arrange
        Video savedVideo = new Video();
        savedVideo.setId(2L);
        savedVideo.setTitle(testVideoCreateDTO.getTitle());
        savedVideo.setUrl(testVideoCreateDTO.getUrl());
        savedVideo.setType(testVideoCreateDTO.getType());
        savedVideo.setDescription(testVideoCreateDTO.getDescription());
        savedVideo.setThumbnailUrl(testVideoCreateDTO.getThumbnailUrl());
        savedVideo.setCreatedAt(LocalDateTime.now());
        savedVideo.setUpdatedAt(LocalDateTime.now());

        when(videoRepository.save(any(Video.class))).thenReturn(savedVideo);

        // Act
        VideoDTO result = videoService.createVideo(testVideoCreateDTO);

        // Assert
        assertNotNull(result);
        assertEquals(testVideoCreateDTO.getTitle(), result.getTitle());
        verify(videoRepository, times(1)).save(any(Video.class));
    }

    @Test
    void updateVideo_WhenVideoExists_ShouldUpdateAndReturnVideo() {
        // Arrange
        when(videoRepository.findById(1L)).thenReturn(Optional.of(testVideo));
        when(videoRepository.save(any(Video.class))).thenReturn(testVideo);

        // Act
        VideoDTO result = videoService.updateVideo(1L, testVideoCreateDTO);

        // Assert
        assertNotNull(result);
        verify(videoRepository, times(1)).findById(1L);
        verify(videoRepository, times(1)).save(any(Video.class));
    }

    @Test
    void updateVideo_WhenVideoNotFound_ShouldThrowException() {
        // Arrange
        when(videoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(VideoNotFoundException.class, () -> videoService.updateVideo(999L, testVideoCreateDTO));
        verify(videoRepository, times(1)).findById(999L);
        verify(videoRepository, never()).save(any(Video.class));
    }

    @Test
    void deleteVideo_WhenVideoExists_ShouldDeleteVideo() {
        // Arrange
        when(videoRepository.existsById(1L)).thenReturn(true);

        // Act
        videoService.deleteVideo(1L);

        // Assert
        verify(videoRepository, times(1)).existsById(1L);
        verify(videoRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteVideo_WhenVideoNotFound_ShouldThrowException() {
        // Arrange
        when(videoRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThrows(VideoNotFoundException.class, () -> videoService.deleteVideo(999L));
        verify(videoRepository, times(1)).existsById(999L);
        verify(videoRepository, never()).deleteById(anyLong());
    }
}




