package com.example.MarkdownNoteTaker;

import org.springframework.data.jpa.repository.JpaRepository;

public interface Repository extends JpaRepository<Note, Long> {
    
}
