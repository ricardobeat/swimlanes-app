package main

import (
	"swimlanes-server/service"
	"swimlanes-server/storage"

	"github.com/labstack/echo/v4"
	"github.com/r3labs/sse/v2"
)

func main() {
	eventServer := sse.New()
	eventServer.AutoReplay = false
	eventServer.AutoStream = true

	memoryStore := storage.NewInMemoryBoardStore()

	echoServer := echo.New()
	echoServer.HideBanner = true

	server := service.NewBoardService(
		echoServer,
		memoryStore,
		eventServer,
	)

	server.Start()
}
