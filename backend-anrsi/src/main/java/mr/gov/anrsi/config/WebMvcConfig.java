package mr.gov.anrsi.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    @Value("${FILE_UPLOAD_DIR:}")
    private String fileUploadDirEnv;
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Priority: 1. Environment variable, 2. Property, 3. Default
        String dirToUse = (fileUploadDirEnv != null && !fileUploadDirEnv.isEmpty()) 
            ? fileUploadDirEnv 
            : uploadDir;
        
        // Serve uploaded files
        Path uploadPath = Paths.get(dirToUse);
        // If relative path, make it relative to the current working directory
        if (!uploadPath.isAbsolute()) {
            uploadPath = Paths.get(System.getProperty("user.dir"), dirToUse);
        }
        String uploadPathStr = uploadPath.toFile().getAbsolutePath();
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPathStr + "/");
    }
    
    // Note: When controllers are conditionally disabled (e.g., when spring.datasource.url is not set),
    // Spring may try to serve API endpoints as static resources. The GlobalExceptionHandler
    // will catch NoResourceFoundException and return a proper JSON error response.
    // To avoid this issue, ensure you're using a profile that has the database configured
    // (e.g., --spring.profiles.active=dev or --spring.profiles.active=prod)
}

