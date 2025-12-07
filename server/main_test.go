package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"swimlanes-server/model"
	"swimlanes-server/service"
	"swimlanes-server/storage"
	"testing"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/r3labs/sse/v2"
)

func TestTaskOperationsUnit(t *testing.T) {
	store := storage.NewInMemoryBoardStore()

	t.Run("CreateTask", func(t *testing.T) {
		board, _ := store.GetBoard("test-board")
		if board == nil {
			board = model.NewBoard("TestUser")
			board.ID = "test-board"
		}

		newTask := model.Task{
			ID:        "task-001",
			Text:      "New Feature",
			Status:    model.TaskStatusTodo,
			CreatedAt: time.Now(),
			CreatedBy: "Developer",
			UpdatedAt: time.Now(),
		}

		board.Tasks = append(board.Tasks, newTask)
		err := store.SaveBoard(board)
		if err != nil {
			t.Fatalf("Failed to save board: %v", err)
		}

		// Verify task exists in store
		board, _ = store.GetBoard("test-board")
		if board == nil {
			t.Fatal("Board not found")
		}
		found := false
		for _, task := range board.Tasks {
			if task.ID == "task-001" {
				found = true
				break
			}
		}
		if !found {
			t.Error("Task not found in board")
		}
	})

	t.Run("UpdateTask", func(t *testing.T) {
		board, _ := store.GetBoard("test-board")
		if board == nil {
			t.Fatal("Board not found")
		}

		// Update the task
		for i, task := range board.Tasks {
			if task.ID == "task-001" {
				board.Tasks[i].Text = "New Feature - In Progress"
				board.Tasks[i].Status = model.TaskStatusOngoing
				board.Tasks[i].UpdatedAt = time.Now()
				break
			}
		}

		err := store.SaveBoard(board)
		if err != nil {
			t.Fatalf("Failed to save board: %v", err)
		}

		// Verify task was updated in store
		board, _ = store.GetBoard("test-board")
		found := false
		for _, task := range board.Tasks {
			if task.ID == "task-001" && task.Status == model.TaskStatusOngoing {
				found = true
				break
			}
		}
		if !found {
			t.Error("Task was not updated in store")
		}
	})

	t.Run("DeleteTask", func(t *testing.T) {
		board, _ := store.GetBoard("test-board")
		if board == nil {
			t.Fatal("Board not found")
		}

		// Delete the task
		for i, task := range board.Tasks {
			if task.ID == "task-001" {
				board.Tasks = append(board.Tasks[:i], board.Tasks[i+1:]...)
				break
			}
		}

		err := store.SaveBoard(board)
		if err != nil {
			t.Fatalf("Failed to save board: %v", err)
		}

		// Verify task was deleted from store
		board, _ = store.GetBoard("test-board")
		for _, task := range board.Tasks {
			if task.ID == "task-001" {
				t.Error("Task was not deleted from store")
			}
		}
	})
}

func TestBoardStore(t *testing.T) {
	store := storage.NewInMemoryBoardStore()

	t.Run("SaveAndGetBoard", func(t *testing.T) {
		board := model.NewBoard("User1")
		board.ID = "test-board-1"
		board.Tasks = []model.Task{
			{ID: "1", Text: "Task 1", Status: model.TaskStatusTodo, CreatedBy: "User1"},
		}

		err := store.SaveBoard(board)
		if err != nil {
			t.Fatalf("Failed to save board: %v", err)
		}

		retrieved, err := store.GetBoard("test-board-1")
		if err != nil {
			t.Fatalf("Failed to get board: %v", err)
		}

		if retrieved == nil {
			t.Fatal("Retrieved board is nil")
		}

		if retrieved.ID != "test-board-1" {
			t.Errorf("Expected board ID 'test-board-1', got '%s'", retrieved.ID)
		}

		if len(retrieved.Tasks) != 1 {
			t.Errorf("Expected 1 task, got %d", len(retrieved.Tasks))
		}
	})

	t.Run("ListBoards", func(t *testing.T) {
		board1 := model.NewBoard("User1")
		board1.ID = "list-test-1"
		board2 := model.NewBoard("User2")
		board2.ID = "list-test-2"

		store.SaveBoard(board1)
		store.SaveBoard(board2)

		boards, err := store.ListBoards()
		if err != nil {
			t.Fatalf("Failed to list boards: %v", err)
		}

		if len(boards) < 2 {
			t.Errorf("Expected at least 2 boards, got %d", len(boards))
		}
	})

	t.Run("DeleteBoard", func(t *testing.T) {
		board := model.NewBoard("User1")
		board.ID = "delete-test"
		store.SaveBoard(board)

		// Verify it exists
		retrieved, _ := store.GetBoard("delete-test")
		if retrieved == nil {
			t.Fatal("Board not found before delete")
		}

		// Delete it
		err := store.DeleteBoard("delete-test")
		if err != nil {
			t.Fatalf("Failed to delete board: %v", err)
		}

		// Verify it's gone
		retrieved, _ = store.GetBoard("delete-test")
		if retrieved != nil {
			t.Error("Board still exists after delete")
		}
	})
}

func TestBoardReadHandler(t *testing.T) {
	store := storage.NewInMemoryBoardStore()
	echoServer := echo.New()
	eventServer := sse.New()
	appServer := service.NewBoardService(echoServer, store, eventServer)

	// Add a task to the test board
	board, _ := store.GetBoard("test-board")
	if board == nil {
		board = model.NewBoard("Tester")
		board.ID = "test-board"
	}
	board.Tasks = append(board.Tasks, model.Task{
		ID:        "list-test-1",
		Text:      "List Test 1",
		Status:    model.TaskStatusTodo,
		CreatedBy: "Tester",
	})
	store.SaveBoard(board)

	req := httptest.NewRequest("GET", "/board/test-board", nil)
	rec := httptest.NewRecorder()
	c := echoServer.NewContext(req, rec)
	c.SetParamNames("boardId")
	c.SetParamValues("test-board")

	err := appServer.BoardRead(c)
	if err != nil {
		t.Fatalf("Handler returned error: %v", err)
	}

	if rec.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", rec.Code)
	}

	var retrievedBoard model.Board
	if err := json.NewDecoder(rec.Body).Decode(&retrievedBoard); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if len(retrievedBoard.Tasks) != 1 {
		t.Errorf("Expected 1 task, got %d", len(retrievedBoard.Tasks))
	}

	if len(retrievedBoard.Tasks) > 0 && retrievedBoard.Tasks[0].ID != "list-test-1" {
		t.Errorf("Expected task ID 'list-test-1', got '%s'", retrievedBoard.Tasks[0].ID)
	}
}
