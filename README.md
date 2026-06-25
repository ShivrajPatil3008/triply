# triply

AI-powered travel itinerary generator that extracts trip details from your documents and uses AI to create a personalized itinerary automatically. Upload your files, let the system analyze the data, and get a structured travel plan instantly.

## Project Flow

### Authentication

- Users can register, login, and logout using JWT-based authentication.
- JWT tokens are used to securely manage user sessions and protect user-specific data.

### AI-Powered Itinerary Generation

- Users can upload travel-related documents/files containing trip details.
- The system extracts text from uploaded documents and processes the extracted information.
- Based on the extracted data, the AI generates a structured travel itinerary with a timeline.

### Document Text Extraction

- For image-based documents, **Tesseract.js** is used for OCR-based text extraction.
- For PDF documents, **pdf-parse** is used to extract text content.
- Currently, the system supports extracting digital text content and has been tested primarily with English documents.
- Handwritten documents and documents in other languages are not fully tested and may require further improvements.

### AI Integration

- The project uses Google Gemini AI models for generating itinerary timelines.
- Currently, the application uses free Gemini API models:
  - **Gemini 2.5 Flash**
  - **Gemini 3.5 Flash**
- The quality and accuracy of generated itineraries depend on the AI model's capabilities and the quality of extracted input data.

### Itinerary Sharing

- Users can generate a unique shareable code for their itinerary.
- Other users can access the shared itinerary using this code without requiring direct access to the original account.

## Technologies Used

### Frontend

- React.js
- Redux Toolkit
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication

### AI & Processing

- Google Gemini AI Models
- Tesseract.js (OCR)
- pdf-parse (PDF text extraction)

## Disclaimer

This project was developed as a demo application as part of an assessment round within a limited timeline. Due to the tight deadline, the focus was on implementing the core functionality and demonstrating the overall approach rather than building a fully production-ready system.

This is **not a production-grade application**. Several areas can be further improved, including:

- Implementing **Redis caching** for better performance and reducing database/API load.
- Adding **BullMQ/job queues** for handling background processing and improving scalability.
- Implementing stronger **rate limiting and security measures** for API protection and DDoS attack prevention.
- Further optimizing existing APIs and improving response performance.
- Adding advanced libraries and techniques for better **data extraction, accuracy, and validation**.
- Improving AI-generated itinerary quality by using more advanced models and paid AI services. Currently, the project uses free Gemini models, which may have limitations in accuracy and consistency.
- Improving error handling, monitoring, logging, testing coverage, and overall system architecture.
- Further improving UI/UX with better theme support, typography, font consistency, responsiveness across different screen sizes, and overall user experience enhancements.

The current implementation represents the best possible solution within the given assessment timeline while leaving room for future enhancements and production-level optimizations.

## AI Model Availability Notice

While using the application, you may occasionally encounter an error like:

```json
{
	"error": {
		"code": 503,
		"message": "This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.",
		"status": "UNAVAILABLE"
	}
}
```

This issue occurs due to temporary high traffic or service limitations on the Google Gemini AI API. The model may become unavailable when usage demand is high or when API rate limits are reached.

Since this project uses free-tier Gemini API models, such interruptions are expected occasionally and are not related to any bug in the application.

If this happens, simply wait for a short time and retry the request.

## Contact

If you have any questions, suggestions, or feedback, feel free to reach out:

- **Developer:** Shivraj Patil
- **Email:** patilshivraj3008@gmail.com
- **LinkedIn:** https://in.linkedin.com/in/patil-shivraj
- **Portfolio:** https://shivraj-patil.onrender.com

```

```
