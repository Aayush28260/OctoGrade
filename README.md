
# Auto-Marker AI App

This is a local-first app designed for elementary school teachers to automatically grade math word problems based on student answers or handwritten work scanned with a camera.

## Frontend

- Built with React + Tailwind CSS
- Upload or type questions and student answers
- OCR support using Tesseract.js

## Backend

- Flask server using llama-cpp-python and DeepSeek-Coder
- Accepts word problem and answer, returns grading and feedback

## Setup

1. Place a `.gguf` model (like DeepSeek) in `backend/models/`
2. Run the Flask backend: `python app.py`
3. Run the React frontend: `npm run dev`

Everything runs locally. No cloud needed. Built for classrooms.
