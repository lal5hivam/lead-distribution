# Project Architecture Plan

## 1. Project Overview

This project is a simple MERN stack application for an internship machine test. An admin logs in, creates agents, uploads a CSV/XLS/XLSX list, and the backend distributes the list items equally among the available agents.

The design keeps the code readable and interview-friendly:

- React frontend with protected pages and plain CSS.
- Express backend with controllers, routes, middleware, models, services, and utilities.
- MongoDB stores admins, agents, upload batches, and assigned list items.
- JWT protects dashboard APIs.

## 2. Folder Structure

```text
task-allocation/
  client/
    src/
      api/
      components/
      context/
      pages/
      App.jsx
      main.jsx
      styles.css
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      scripts/
      services/
      utils/
      app.js
      server.js
  docs/
    PROJECT_PLAN.md
  README.md
```

## 3. Database Schema Design

### Admin

Stores the administrator who can log in and use the dashboard.

- `name`: display name.
- `email`: unique login email.
- `password`: hashed password.
- `createdAt`, `updatedAt`: audit timestamps.

### Agent

Stores the agents who receive distributed records.

- `name`: agent name.
- `email`: unique email.
- `mobile`: country-code mobile number.
- `password`: hashed password.
- `createdAt`, `updatedAt`: audit timestamps.

### DistributionBatch

Stores one uploaded file event.

- `fileName`: original uploaded file name.
- `uploadedBy`: admin id.
- `totalRecords`: number of valid rows.
- `agentsUsed`: agent ids used in distribution.
- `status`: `completed` or `failed`.
- `createdAt`, `updatedAt`: audit timestamps.

### AssignedTask

Stores each row assigned to an agent.

- `batch`: distribution batch id.
- `agent`: assigned agent id.
- `firstName`: value from `FirstName`.
- `phone`: value from `Phone`.
- `notes`: value from `Notes`.
- `rowNumber`: uploaded row position.
- `createdAt`, `updatedAt`: audit timestamps.

## 4. API List

- `POST /api/auth/login`: admin login, returns JWT and admin data.
- `POST /api/agents`: creates a new agent after validation.
- `GET /api/agents`: returns all agents without passwords.
- `POST /api/upload`: uploads CSV/XLS/XLSX, validates rows, distributes records.
- `GET /api/distributions`: returns distribution batches with agent counts.
- `GET /api/distributions/:agentId`: returns tasks assigned to one agent.
- `DELETE /api/distributions`: clears uploaded batches and assigned tasks.

## 5. Distribution Logic Algorithm

1. Parse the uploaded file into rows.
2. Validate required columns: `FirstName`, `Phone`, `Notes`.
3. Validate every row before saving anything.
4. Load all agents sorted by creation date.
5. Calculate `agentCount = agents.length`.
6. Calculate `baseCount = Math.floor(totalRows / agentCount)`.
7. Calculate `remainder = totalRows % agentCount`.
8. Agent 1 to `remainder` receives `baseCount + 1` records.
9. Remaining agents receive `baseCount` records.
10. Save one distribution batch and all assigned tasks.

## 6. Frontend Page Flow

1. Login page authenticates the admin and stores the JWT.
2. Protected layout shows dashboard navigation.
3. Dashboard summarizes agents and recent distribution batches.
4. Agents page creates agents and lists existing agents.
5. Upload page sends CSV/XLS/XLSX files to the backend.
6. Distributions page shows batches and tasks grouped by selected agent.
7. Logout clears the local session and returns to login.

## 7. Environment Variables

### Backend

- `PORT`: backend port, default `5000`.
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: secret used to sign tokens.
- `JWT_EXPIRES_IN`: token lifetime, default `1d`.
- `CLIENT_URL`: frontend URL for CORS.

### Frontend

- `VITE_API_URL`: backend API base URL, default `http://localhost:5000/api`.

## 8. README Outline

- Project overview
- Tech stack
- Folder structure
- Environment variables
- Database schemas
- API documentation
- File upload workflow
- Distribution logic
- Setup and run instructions
- Sample test credentials
- Screenshots/video demo placeholders
- Troubleshooting
