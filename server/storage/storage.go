package storage

import (
	"swimlanes-server/model"
	"sync"
	"time"
)

type BoardStore interface {
	CreateBoard(author string) (*model.Board, error)
	GetBoard(id string) (*model.Board, error)
	SaveBoard(board *model.Board) error
	DeleteBoard(id string) error
	ListBoards() ([]*model.Board, error)
	GetTask(board *model.Board, id string) (*model.Task, error)
	CreateTask(board *model.Board, task model.Task) error
	UpdateTask(board *model.Board, task model.Task) error
	DeleteTask(board *model.Board, taskID string) error
}

// InMemoryBoardStore is an in-memory implementation of BoardStore using a sync.Map for thread safety.
type InMemoryBoardStore struct {
	boards sync.Map
}

func NewInMemoryBoardStore() *InMemoryBoardStore {
	return &InMemoryBoardStore{}
}

func (s *InMemoryBoardStore) CreateBoard(author string) (*model.Board, error) {
	board := model.NewBoard(author)
	board.Tasks = model.MakePlaceholderTasks(author)
	if err := s.SaveBoard(board); err != nil {
		return nil, err
	}

	return board, nil
}

func (s *InMemoryBoardStore) GetBoard(id string) (*model.Board, error) {
	value, exists := s.boards.Load(id)
	if !exists {
		return nil, nil
	}
	board := value.(*model.Board)
	return board, nil
}

func (s *InMemoryBoardStore) SaveBoard(board *model.Board) error {
	board.UpdatedAt = time.Now()
	s.boards.Store(board.ID, board)
	return nil
}

func (s *InMemoryBoardStore) DeleteBoard(id string) error {
	s.boards.Delete(id)
	return nil
}

func (s *InMemoryBoardStore) ListBoards() ([]*model.Board, error) {
	boards := make([]*model.Board, 0)
	s.boards.Range(func(key, value any) bool {
		board := value.(*model.Board)
		boards = append(boards, board)
		return true
	})
	return boards, nil
}

func (s *InMemoryBoardStore) CreateTask(board *model.Board, task model.Task) error {
	task.CreatedAt = time.Now()
	task.UpdatedAt = time.Now()
	board.Tasks = append(board.Tasks, task)
	return nil
}

func (s *InMemoryBoardStore) GetTask(board *model.Board, id string) (*model.Task, error) {
	for _, task := range board.Tasks {
		if task.ID == id {
			return &task, nil
		}
	}
	return nil, nil
}

func (s *InMemoryBoardStore) UpdateTask(board *model.Board, task model.Task) error {
	found := false
	for i, t := range board.Tasks {
		if t.ID == task.ID {
			task.UpdatedAt = time.Now()
			board.Tasks[i] = task
			found = true
			break
		}
	}

	if !found {
		return ErrTaskNotFound
	}

	return nil
}

func (s *InMemoryBoardStore) DeleteTask(board *model.Board, taskID string) error {
	found := false
	for i, t := range board.Tasks {
		if t.ID == taskID {
			board.Tasks = append(board.Tasks[:i], board.Tasks[i+1:]...)
			found = true
			break
		}
	}

	if !found {
		return ErrTaskNotFound
	}

	return nil
}
