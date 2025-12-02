Case–Study Write–Up Template (place in README.md)

*Executive Summary

Problem: Common gym-goers struggle to plan workouts because occupancy peaks make equipment unavailable.

Solution: Gym Occupancy Predictor ingests historical check-in data, exposes a FastAPI service that returns expected crowd sizes per hour, and pairs it with a Vite/React frontend so students instantly see “low/medium/high” crowd bands and pick quieter times. 

*System Overview

Course Concept(s): 

Module Used -- Case 4-5: Flask, JSON, and APIs

Architecture Diagram: Include a PNG in /assets and embed it here.

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/ec5330bb-fabf-42ea-9789-ac6f555946a4" />

*Data/Models/Services: List sources, sizes, formats, and licenses.

<img width="1165" height="317" alt="image" src="https://github.com/user-attachments/assets/3433d93b-287a-45cb-b991-27bf96bb149c" />


How to Run (Local)

Docker:

# docker build -t gym-occupancy:latest .
# docker run --rm -p 8000:8000 gym-occupancy:latest
# curl http://localhost:8000/docs

5) Design Decisions
Why this concept? Alternatives considered and why not chosen.

I particularly chose this concept because it intrigued me how the gym would always seemingly be crowded at some times that I would visit, and other times it would be nearly empty. This phenomenom interested me. Historical averages offer explainable predictions without training a heavier ML model; FastAPI already powers course labs, so I made this project with past data so peers can review easily.

Alternatives considered:

Bi-directional communication platform (Deaf person communication with Hearing person): Would require an insane amount of data to train a model on ASL let alone all languages.

Recurrent neural net: Overkill for hourly buckets; would complicate deploy size.

Tradeoffs:

Performance: Averaging similar rows keeps inference <50 ms but can underfit rare holidays.

Cost/Complexity: Pure Python + CSV avoids external DB costs; front/back separation adds some complexity but improves maintainability.

Security/Privacy: 

*Config comes from .env, and inputs are validated/typed in FastAPI schemas; UI never stores PII. @.env.example#1-1 @Dockerfile#17-31

*Ops: Logs flow to the FastAPI console (visible via uvicorn), and the frontend dev server prints requests; run script spawns dedicated windows for monitoring. Known limits: predictions assume stationarity and don’t yet handle missing CSV rows gracefully. @run.ps1#1-35

7) Results & Evaluation

Performance Notes:

Backend container cold start: ~8 s on lab laptops (pip install + uvicorn).
Average API response: <0.1 s for cached CSV reads; frontend reuses same data for UX hints.

Validation/tests performed and outcomes:

Manual smoke tests: Verified GET /predict for multiple day/hour combos; ensured fallback averages kick in when month-specific rows are missing.
Dataset sanity: Parser drops rows lacking numeric number_people, day_of_week, hour, and month to prevent NaNs from corrupting predictions. (Originally an issue in src/utils/dataParser.ts#28-76)
Frontend UX: Confirmed day selector renders full names and copy updates summary text, preventing earlier misspellings. (Originally an issue in src/App.tsx#80-170)

8) What’s Next

Correlate crowdiness with workout outcomes (new dataset combining survey progress with predicted occupancy).
Mobile-first responsive tweaks (stacked selectors, condensed typography).
Model refinement (weekday-seasonality weights, holiday overrides, caching).

9) Links (Required)

##GitHub Repo: [https://github.com/iAbel1478/gymproject.git]([url](https://github.com/iAbel1478/gymproject.git))

Public Cloud App (optional):

##[https://gymproject-chi.vercel.app/]([url](https://gymproject-chi.vercel.app/))

# Citations

## Dataset
- **Title**: Crowdedness at the Campus Gym
- **Author**: nsrose7224
- **Source**: [Kaggle Dataset](https://www.kaggle.com/datasets/nsrose7224/crowdedness-at-the-campus-gym)
- **License**: CC0: Public Domain

## Related Work
- **Title**: Gym Crowd Size Prediction
- **Author**: Gabriel Atkin (gcdatkin)
- **Source**: [Kaggle Notebook](https://www.kaggle.com/code/gcdatkin/gym-crowd-size-prediction)
- **License**: MIT License
