package mr.gov.anrsi.config;

import java.io.File;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import mr.gov.anrsi.service.AppelsCandidaturesImportService;

@Component
@Order(2)
@ConditionalOnProperty(name = "app.import.appels-candidatures", havingValue = "true")
public class AppelsCandidaturesDataLoader implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(AppelsCandidaturesDataLoader.class);
    
    @Autowired
    private AppelsCandidaturesImportService importService;
    
    @Value("${app.import.appels-candidatures.file:appelalacandidature.json}")
    private String jsonFilePath;
    
    @Override
    public void run(String... args) throws Exception {
        try {
            // Try to find file in current directory or project root
            File file = new File(jsonFilePath);
            if (!file.exists()) {
                // Try in backend-anrsi directory
                file = new File("backend-anrsi/" + jsonFilePath);
            }
            if (!file.exists()) {
                // Try absolute path from project root
                file = new File(System.getProperty("user.dir") + "/backend-anrsi/" + jsonFilePath);
            }
            
            if (file.exists()) {
                logger.info("Importing appels candidatures from: {}", file.getAbsolutePath());
                importService.importFromJsonFile(file.getAbsolutePath());
                logger.info("Successfully imported appels candidatures");
            } else {
                logger.warn("JSON file not found: {}. Skipping import.", jsonFilePath);
            }
        } catch (Exception e) {
            logger.error("Error importing appels candidatures", e);
            // Don't fail startup if import fails
        }
    }
}
