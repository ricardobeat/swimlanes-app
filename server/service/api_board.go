package service

import (
	"net/http"
	"swimlanes-server/model"

	"github.com/labstack/echo/v4"
)

func (s *BoardService) BoardCreate(c echo.Context) error {
	var newBoard model.Board
	if err := c.Bind(&newBoard); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	createdBy := c.(*ServiceContext).User()
	board, err := s.Store.CreateBoard(createdBy)

	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create board: "+err.Error())
	}

	return c.JSON(http.StatusCreated, board)
}

func (s *BoardService) BoardRead(c echo.Context) error {
	board, err := s.Store.GetBoard(c.Param("boardId"))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to get board: "+err.Error())
	}
	if board == nil {
		return echo.NewHTTPError(http.StatusNotFound, "Board not found")
	}

	return c.JSON(http.StatusOK, board)
}
