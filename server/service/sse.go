package service

import (
	"encoding/json"
	"strconv"
	"swimlanes-server/model"
	"time"

	"github.com/r3labs/sse/v2"
)

type TaskAction string

const (
	TaskActionCreate TaskAction = "create"
	TaskActionUpdate TaskAction = "update"
	TaskActionDelete TaskAction = "delete"
)

func NewUpdateEvent(t TaskAction, task model.Task) *sse.Event {
	data, _ := json.Marshal(task)
	return &sse.Event{
		ID:    []byte(strconv.FormatInt(time.Now().UTC().UnixNano(), 10)),
		Event: []byte(t),
		Data:  data,
	}
}
