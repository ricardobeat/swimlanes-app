package service

import (
	"github.com/labstack/echo/v4"
)

func (s *BoardService) EventStream(c echo.Context) error {
	s.SSE.ServeHTTP(c.Response().Writer, c.Request())
	return nil
}
