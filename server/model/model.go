package model

import (
	"time"

	"github.com/google/uuid"
)

type TaskStatus string

const (
	TaskStatusTodo    TaskStatus = "todo"
	TaskStatusOngoing TaskStatus = "ongoing"
	TaskStatusDone    TaskStatus = "done"
)

type Task struct {
	ID        string     `json:"id"`
	Text      string     `json:"text"`
	Status    TaskStatus `json:"status"`
	CreatedAt time.Time  `json:"createdAt"`
	CreatedBy string     `json:"createdBy"`
	UpdatedAt time.Time  `json:"updatedAt"`
}

func NewTask(id, title string, status TaskStatus, createdBy string) *Task {
	return &Task{
		ID:        id,
		Text:      title,
		Status:    status,
		CreatedAt: time.Now(),
		CreatedBy: createdBy,
		UpdatedAt: time.Now(),
	}
}

func MakePlaceholderTasks(author string) []Task {
	return []Task{
		*NewTask(uuid.New().String(), "Bake the cake", "todo", author),
		*NewTask(uuid.New().String(), "Replace servo #2", "todo", author),
		*NewTask(uuid.New().String(), "Buy chlorine tablets", "todo", author),
		*NewTask(uuid.New().String(), "Write new release announcement", "done", author),
	}
}

type Board struct {
	ID        string    `json:"id"`
	CreatedBy string    `json:"createdBy"`
	Tasks     []Task    `json:"tasks"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func NewBoard(createdBy string) *Board {
	return &Board{
		ID:        uuid.New().String(),
		CreatedBy: createdBy,
		Tasks:     []Task{},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}
