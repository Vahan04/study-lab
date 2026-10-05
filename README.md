# StudyLab

StudyLab is a portfolio-ready physics and mathematics study assistant. This first version is a fast, dependency-free frontend prototype that works offline:

- Ask the local demo tutor about quantum mechanics, calculus, circuit analysis, or probability.
- Browse a small formula desk.
- Follow a concept map.
- Track a study streak and weekly progress.
- Switch between light and dark themes.

## Run it

Open `index.html` in a browser, or serve the folder with any static server:

```bash
cd study-lab
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Next portfolio upgrade

The demo tutor can be connected to a Python/FastAPI backend and an LLM API. Keep the current response shape and replace `findReply()` in `app.js` with a `fetch()` call to the backend. A strong next feature would be a Julia-powered quantum simulation panel for Bloch-sphere and Rabi-oscillation experiments.
