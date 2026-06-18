# PlaceToInvestHome

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.11.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Local MEAN + RAG microservice setup

The RAG project is kept as an independent FastAPI microservice under `RAG/profood-rag-ollama`. Angular must call the Express API gateway only. Express then forwards authenticated assistant requests to FastAPI with the same `Authorization: Bearer <JWT>` header.

Use the root Angular app and root Express backend for the integrated system. The old RAG prototype frontend and auth service have been removed from `RAG`; only `RAG/profood-rag-ollama` is needed for the FastAPI microservice.

### Environment

Root backend `.env`:

```env
PORT=5055
CLIENT_URL=http://localhost:4200
RAG_SERVICE_URL=http://localhost:8000
JWT_SECRET=your_secret
MONGO_URI=your_mongodb_uri
```

RAG service `.env` in `RAG/profood-rag-ollama`:

```env
JWT_SECRET=your_secret
OLLAMA_BASE_URL=http://localhost:11434
MONGO_URI=your_mongodb_uri
CHROMA_PATH=./chroma_db
```

Use the same `JWT_SECRET` in both files so FastAPI can verify the JWT created by Express.

### Terminal 1: Ollama

```bash
ollama serve
```

Run these once in another terminal if the models are not installed yet:

```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

For image questions, also run:

```bash
ollama pull llava:7b
```

### Terminal 2: FastAPI RAG service

```bash
cd RAG/profood-rag-ollama
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The RAG service should be available at `http://localhost:8000`.

### Terminal 3: Express backend / API gateway

```bash
npm install
npm run backend:dev
```

The backend gateway should be available at `http://localhost:5055`.

### Terminal 4: Angular frontend

```bash
npm start
```

The Angular app should be available at `http://localhost:4200`.

### Run document ingestion

Put source documents in `RAG/profood-rag-ollama/data/rag_sources`, then run ingestion against the FastAPI service:

```powershell
Invoke-RestMethod -Method Post "http://localhost:8000/ingest?reset=true"
```

If `ALLOW_UNPROTECTED_INGEST=false`, include an admin JWT:

```powershell
$token = "<admin JWT>"
Invoke-RestMethod -Method Post "http://localhost:8000/ingest?reset=true" -Headers @{ Authorization = "Bearer $token" }
```

### Assistant request flow

```txt
Angular
-> POST /api/assistant/ask
-> Express API Gateway
-> POST http://localhost:8000/ask
-> FastAPI RAG
-> ChromaDB + Ollama + MongoDB chat history
```

Supported gateway routes:

```txt
POST   /api/assistant/ask
POST   /api/assistant/ask/stream
POST   /api/assistant/voice/transcribe
POST   /api/assistant/tts/speak
POST   /api/assistant/image/ask
POST   /api/assistant/sessions
GET    /api/assistant/sessions
GET    /api/assistant/sessions/:id
DELETE /api/assistant/sessions/:id
```

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
