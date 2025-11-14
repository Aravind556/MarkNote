// src/test/java/com/example/MarkdownNoteTaker/Controller/controllerTest.java
package com.example.MarkdownNoteTaker;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controller.class)
@org.springframework.context.annotation.Import(controllerTest.MockConfig.class)
public class controllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private service service;

    @org.springframework.boot.test.context.TestConfiguration
    static class MockConfig {
        @org.springframework.context.annotation.Bean
        public service service() {
            return org.mockito.Mockito.mock(service.class);
        }
    }

    @Test
    
    public void uploadFile_success() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.md",
                "text/markdown",
                "Hello world".getBytes()
        );

        when(service.ack(any(MultipartFile.class))).thenReturn("uploaded");

        // Act & Assert
        mockMvc.perform(multipart("/hi/file")
                        .file(file)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(content().string("uploaded"));

        verify(service).ack(any(MultipartFile.class));
    }

    @Test
    public void uploadFile_serviceThrows() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.md",
                "text/markdown",
                "Hello world".getBytes()
        );

        when(service.ack(any(MultipartFile.class))).thenThrow(new RuntimeException("boom"));

        // Act & Assert
        mockMvc.perform(multipart("/hi/file")
                        .file(file)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("File upload failed."));

        verify(service).ack(any(MultipartFile.class));
    }
}