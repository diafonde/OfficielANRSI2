package mr.gov.anrsi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files
        Path uploadPath = Paths.get(uploadDir);
        // If relative path, make it relative to the current working directory
        if (!uploadPath.isAbsolute()) {
            uploadPath = Paths.get(System.getProperty("user.dir"), uploadDir);
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

