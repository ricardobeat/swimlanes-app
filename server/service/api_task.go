package service

import (
	"net/http"
	"swimlanes-server/model"
	"swimlanes-server/storage"

	"github.com/labstack/echo/v4"
)

// creates a new task
func (s *BoardService) TaskCreate(c echo.Context) error {
	listId := c.Param("boardId")
	var newTask model.Task
	if err := c.Bind(&newTask); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	board, err := s.Store.GetBoard(listId)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get board: "+err.Error())
	}

	author := c.(*ServiceContext).User()
	newTask.CreatedBy = author

	if err = s.Store.CreateTask(board, newTask); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create task: "+err.Error())
	}

	s.SSE.Publish(listId, NewUpdateEvent(TaskActionCreate, newTask))

	return c.JSON(http.StatusCreated, newTask)
}

func validateStatusChange(t1 model.Task, t2 model.Task) bool {
	switch {
	case t1.Status == "todo" && t2.Status == "done":
		return false

	case t1.Status == "done" && t2.Status == "todo":
		return false
	}
	return true
}

func (s *BoardService) TaskUpdate(c echo.Context) error {
	listId := c.Param("boardId")
	var updatedTask model.Task
	if err := c.Bind(&updatedTask); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	board, err := s.Store.GetBoard(listId)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get board: "+err.Error())
	}

	existingTask, err := s.Store.GetTask(board, updatedTask.ID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get task: "+err.Error())
	}

	if existingTask.Status == "todo" && updatedTask.Status == "done" || existingTask.Status == "done" && updatedTask.Status == "todo" {
		return echo.NewHTTPError(http.StatusUnprocessableEntity, "Invalid status change")
	}

	if err = s.Store.UpdateTask(board, updatedTask); err != nil {
		if err == storage.ErrTaskNotFound {
			return echo.NewHTTPError(http.StatusNotFound, "Task not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update task: "+err.Error())
	}

	s.SSE.Publish(listId, NewUpdateEvent(TaskActionUpdate, updatedTask))

	return c.JSON(http.StatusOK, updatedTask)
}

func (s *BoardService) TaskDelete(c echo.Context) error {
	listId := c.Param("boardId")
	taskId := c.Param("taskId")

	board, err := s.Store.GetBoard(listId)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get board: "+err.Error())
	}

	if err = s.Store.DeleteTask(board, taskId); err != nil {
		if err == storage.ErrTaskNotFound {
			return echo.NewHTTPError(http.StatusNotFound, "Task not found")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update task: "+err.Error())
	}

	s.SSE.Publish(listId, NewUpdateEvent(TaskActionDelete, model.Task{ID: taskId}))

	return c.JSON(http.StatusOK, map[string]string{"status": "deleted", "id": taskId})
}
