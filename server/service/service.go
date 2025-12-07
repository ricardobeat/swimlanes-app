package service

import (
	"net/http"

	"swimlanes-server/storage"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/r3labs/sse/v2"
)

const X_USER_ID_HEADER = "X-User-Id"

// BoardService manages boards and handles HTTP requests
type BoardService struct {
	Echo  *echo.Echo
	Store storage.BoardStore
	SSE   *sse.Server
}

type ServiceContext struct {
	echo.Context
}

func (c *ServiceContext) User() string {
	return c.Get("user").(string)
}

func NewBoardService(echoServer *echo.Echo, store storage.BoardStore, eventServer *sse.Server) *BoardService {
	return &BoardService{
		Echo:  echoServer,
		Store: store,
		SSE:   eventServer,
	}
}

func UserMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		userID := c.Request().Header.Get(X_USER_ID_HEADER)
		cc := &ServiceContext{Context: c}
		cc.Set("user", userID)
		return next(cc)
	}
}

func (s *BoardService) Start() {
	e := s.Echo

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
		AllowHeaders: []string{"Content-Type", X_USER_ID_HEADER},
	}))

	e.Use(middleware.Logger())

	e.GET("/events" /*?stream=boardId */, s.EventStream)

	e.Use(UserMiddleware)

	e.GET("/boards/:boardId", s.BoardRead)
	e.POST("/boards", s.BoardCreate)

	e.POST("/boards/:boardId/tasks", s.TaskCreate)
	e.PUT("/boards/:boardId/tasks/:taskId", s.TaskUpdate)
	e.DELETE("/boards/:boardId/tasks/:taskId", s.TaskDelete)

	e.Logger.Info("Server starting on :3002")
	e.Logger.Fatal(e.Start(":3002"))
}
