# Backend (FastAPI)

## Setup

1. Create a virtual environment:
   
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   
   ```bash
   pip install -r requirements.txt
   ```

3. Run the development server:
   
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at http://localhost:8000

## Testing

### Running Tests

To run all tests:

```bash
pytest
```

To run tests with verbose output:

```bash
pytest -v
```

To run tests in a specific file:

```bash
pytest tests/test_main.py
```

To run tests with coverage:

```bash
pytest --cov=app
```
