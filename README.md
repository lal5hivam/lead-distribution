# Task Allocation MERN App

Admin Login + Agent Management + CSV/XLSX Upload and Task Distribution.

This is a clean internship-level MERN stack project. It uses JWT authentication, MongoDB storage, agent creation, file parsing, row validation, and equal distribution of uploaded list items among the available agents.

## Tech Stack

- Frontend: React.js, Vite, plain CSS, lucide-react icons
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Authentication: JWT
- Password hashing: bcryptjs
- Uploads: multer
- File parsing: csv-parser, xlsx

## Folder Structure

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
```

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_allocation
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Example files are already included as `server/.env.example` and `client/.env.example`.

## Database Schemas

### Admin

Stores admin login data.

- `name`
- `email`
- `password` as bcrypt hash
- timestamps

### Agent

Stores agents who receive assigned records.

- `name`
- `email`
- `mobile` with country code
- `password` as bcrypt hash
- timestamps

### DistributionBatch

Stores one uploaded file event.

- `fileName`
- `uploadedBy`
- `totalRecords`
- `agentsUsed`
- `status`
- timestamps

### AssignedTask

Stores each distributed row.

- `batch`
- `agent`
- `firstName`
- `phone`
- `notes`
- `rowNumber`
- timestamps

## API Documentation

All routes except login require:

```http
Authorization: Bearer <token>
```

### POST /api/auth/login

Purpose: Login admin and return JWT.

Request:

```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

Response:

```json
{
  "message": "Login successful.",
  "token": "jwt_token_here",
  "admin": {
    "id": "admin_id",
    "name": "Demo Admin",
    "email": "admin@example.com"
  }
}
```

### POST /api/agents

Purpose: Add an agent.

Request:

```json
{
  "name": "Riya Sharma",
  "email": "riya@example.com",
  "mobile": "+919876543210",
  "password": "Agent123"
}
```

### GET /api/agents

Purpose: List all agents without passwords.

### POST /api/upload

Purpose: Upload CSV/XLS/XLSX and distribute rows among all available agents.

Form field:

```text
file=<CSV/XLS/XLSX file>
```

Required columns:

```text
FirstName, Phone, Notes
```

Sample CSV:

```csv
FirstName,Phone,Notes
Aarav,9876543210,Interested in demo
Meera,9876543211,Call after 5 PM
```

### GET /api/distributions

Purpose: List upload batches with per-agent counts.

### GET /api/distributions/:agentId

Purpose: List tasks assigned to one agent.

### DELETE /api/distributions

Purpose: Clear all upload batches and assigned task records. This does not delete agents or admin users.

## File Upload Workflow

1. Admin selects a `.csv`, `.xlsx`, or `.xls` file.
2. Backend validates the file extension.
3. Backend parses the file.
4. Backend checks required columns.
5. Backend validates every row.
6. Backend confirms at least one agent exists.
7. Backend saves one distribution batch and assigned task records.
8. Frontend displays the distribution summary.

## Distribution Logic

Records are distributed among the actual number of agents available in MongoDB.

Example: 23 records and 7 agents

- Base count: `Math.floor(23 / 7) = 3`
- Remainder: `23 % 7 = 2`
- Agent 1 gets 4
- Agent 2 gets 4
- Agents 3 to 7 get 3 each

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

3. Start MongoDB locally.

4. Seed admin credentials:

```bash
npm run seed
```

5. Start frontend and backend:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Sample Test Credentials

```text
Email: admin@example.com
Password: Admin@123
```

Use `npm run seed` after MongoDB is running to create this admin.

## Screenshots / Video Demo Placeholder

- Login page screenshot
- Dashboard screenshot
- Add agent screenshot
- Upload success screenshot
- Distributed list screenshot
- Demo video link: add Google Drive URL here

## Troubleshooting

### MongoDB connection failed

Check that MongoDB is running and `MONGO_URI` is correct in `server/.env`.

### Login fails with valid credentials

Run the seed command again:

```bash
npm run seed
```

### Upload says an agent is required

Add at least one agent before uploading a list file.

### Upload says missing columns

The first row of the file must include:

```text
FirstName, Phone, Notes
```

### CORS error

Make sure `CLIENT_URL` in `server/.env` matches the frontend URL.
