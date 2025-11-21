# MarkdownNoteTaker

MarkdownNoteTaker is a Spring Boot application for creating, uploading, checking, and correcting Markdown notes. It integrates grammar and spelling correction, AI-powered content correction (Google Gemini), and provides RESTful endpoints for frontend consumption.

## Features
- Upload and save Markdown notes
- Grammar and spelling check using LanguageTool
- AI-powered correction using Google Gemini
- Retrieve notes and issues
- RESTful API endpoints for all operations

## Technologies Used
- Java 21
- Spring Boot
- MySQL (JPA/Hibernate)
- LanguageTool (grammar/spelling)
- Google Gemini API (AI correction)
- Flexmark (Markdown parsing)
- Lombok

## Setup Instructions
1. **Clone the repository**
2. **Configure MySQL**: Update `src/main/resources/application.properties` with your DB credentials.
3. **Set Google Gemini API Key**: Set the environment variable `GOOGLE_API_KEY` before running the app.
4. **Build and run**:
   ```sh
   mvn clean install
   mvn spring-boot:run
   ```

## API Endpoints

### 1. Upload Markdown Note
- **POST** `/hi/upload`
- **Body**: `multipart/form-data` with key `File` (Markdown file)
- **Response**: Saved note object

### 2. Grammar Check
- **POST** `/hi/grammar`
- **Body**: `multipart/form-data` with key `File` (Markdown file)
- **Response**: JSON object with `correctedText` and `issues` (list of grammar issues)

### 3. Live Grammar Check
- **POST** `/hi/live`
- **Body**: Raw Markdown text (plain text)
- **Response**: JSON array of grammar issues

### 4. Get All Notes
- **GET** `/hi/notes`
- **Response**: List of all saved notes

### 5. Get Note by ID
- **GET** `/hi/notes/{id}`
- **Response**: Note object

### 6. AI Correction (Gemini)
- **POST** `/hi/ai-correct`
- **Body**: Raw Markdown text (plain text)
- **Response**: JSON object with AI-corrected text and issues

## Response Structure
### Grammar/AI Correction
```json
{
  "correctedText": "string - the fully corrected markdown text",
  "issues": [
    {
      "line": number,
      "original": "string - the original incorrect portion",
      "suggestion": "string - corrected text",
      "explanation": "string - brief reason"
    }
  ]
}
```

## Frontend Integration Guide
- Use file upload for `/hi/upload` and `/hi/grammar` endpoints.
- Use raw text for `/hi/live` and `/hi/ai-correct` endpoints.
- Display returned `issues` as inline annotations or tooltips in the editor.
- Show `correctedText` as the corrected Markdown preview.
- For note listing and retrieval, use `/hi/notes` and `/hi/notes/{id}`.
- Handle error responses (e.g., missing API key, model overload) gracefully.

## Environment Variables
- `GOOGLE_API_KEY`: Required for Gemini AI correction.

## Example Postman Usage
- **Upload**: `POST /hi/upload` with `form-data` key `File`
- **Grammar Check**: `POST /hi/grammar` with `form-data` key `File`
- **Live Check**: `POST /hi/live` with raw Markdown text
- **AI Correction**: `POST /hi/ai-correct` with raw Markdown text

## License
MIT

## Author
Aravind556
