# Swimlanes Server API

Base URL: `http://localhost:3002`

## Authentication

All endpoints (except SSE) require the `X-User-ID` header to identify the user making the request.

**Headers:**
```
X-User-ID: string
```

## Endpoints

### POST /boards
Create a new board.

**Request Body:**
```json
{}
```

**Response:** Created Board object (201)
```json
{
  "id": "string",
  "createdBy": "string",
  "tasks": [],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### GET /boards/{boardId}
Get a board and all its tasks.

**Response:** Board object with tasks (200)
```json
{
  "id": "string",
  "createdBy": "string",
  "tasks": [
    {
      "id": "string",
      "text": "string",
      "status": "todo" | "ongoing" | "done",
      "createdAt": "2024-01-01T00:00:00Z",
      "createdBy": "string",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### POST /boards/{boardId}/tasks
Create a new task in a board.

**Request Body:**
```json
{
  "id": "string",
  "text": "string",
  "status": "todo" | "ongoing" | "done"
}
```

**Response:** Created Task object (201)
```json
{
  "id": "string",
  "text": "string",
  "status": "todo" | "ongoing" | "done",
  "createdAt": "2024-01-01T00:00:00Z",
  "createdBy": "string",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### PUT /boards/{boardId}/tasks/{taskId}
Update an existing task.

**Request Body:**
```json
{
  "id": "string",
  "text": "string",
  "status": "todo" | "ongoing" | "done"
}
```

**Response:** Updated Task object (200)
```json
{
  "id": "string",
  "text": "string",
  "status": "todo" | "ongoing" | "done",
  "createdAt": "2024-01-01T00:00:00Z",
  "createdBy": "string",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### DELETE /boards/{boardId}/tasks/{taskId}
Delete a task.

**Response:** (200)
```json
{
  "status": "deleted",
  "id": "string"
}
```

### GET /events
Server-Sent Events (SSE) endpoint for real-time task updates.

**Query Parameters:**
- `stream` - Board ID to subscribe to updates for

**Example:** `/events?stream=board-123`

**Response:** SSE stream with events:
```json
{
  "board_id": "string",
  "task": {
    "id": "string",
    "text": "string",
    "status": "todo" | "ongoing" | "done",
    "createdAt": "2024-01-01T00:00:00Z",
    "createdBy": "string",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "action": "create" | "update" | "delete"
}
```

## Data Models

### Task
- `id` (string) - Unique identifier
- `text` (string) - Task description
- `status` (string) - One of: `todo`, `ongoing`, `done`
- `createdAt` (string) - ISO 8601 timestamp
- `createdBy` (string) - User ID who created the task
- `updatedAt` (string) - ISO 8601 timestamp

### Board
- `id` (string) - Unique identifier
- `createdBy` (string) - User ID who created the board
- `tasks` (array) - Array of Task objects
- `createdAt` (string) - ISO 8601 timestamp
- `updatedAt` (string) - ISO 8601 timestamp

## Task Status Values
- `todo` - Task not started
- `ongoing` - Task in progress
- `done` - Task completed

## CORS Configuration
The API allows requests from `http://localhost` with credentials.

**Allowed Methods:** GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers:** Content-Type, X-User-ID
