<script lang="ts">
  import CardPlaceholder from "./CardPlaceholder.svelte";
  import { tasks } from "../stores/tasks.js";
  import { addTask, updateTaskStatus, deleteTask } from "src/api/tasks";
  import TaskInput from "./TaskInput.svelte";

  import type { Task } from "src/types/task";
  import TaskCard from "./TaskCard.svelte";
  import Modal from "./Modal.svelte";

  interface Props {
    accept?: string[];
    status: Task["status"];
    canAdd?: boolean;
  }

  let { status, accept, canAdd = false }: Props = $props();

  const MT_PREFIX = "text/x-task-";
  let currentMimetype = $derived(MT_PREFIX + status);
  let items = $derived($tasks.filter((task) => task.status === status));
  let hoverState = $state<"idle" | "hover" | "invalid">("idle");

  function parseStatus(mimetype: string): string {
    return mimetype.split(MT_PREFIX)[1];
  }

  const handleDragOver = (event: DragEvent): void => {
    if (!event.dataTransfer) return;

    const sourceStatus = parseStatus(event.dataTransfer.types[0]);
    const accepted = accept?.includes(sourceStatus) ?? true;

    // don't show hover state when dragging over the source lane
    if (sourceStatus === status) {
      return;
    }

    if (accepted) {
      hoverState = "hover";
      event.preventDefault();
    } else {
      hoverState = "invalid";
    }
  };

  const handleDragLeave = (): void => {
    hoverState = "idle";
  };

  const handleDrop = (event: DragEvent): void => {
    if (!event.dataTransfer) return;
    event.preventDefault();
    const mimetype = event.dataTransfer.types[0];
    const sourceStatus = parseStatus(mimetype);
    const id = event.dataTransfer?.getData(mimetype);
    const accepted = accept?.includes(sourceStatus) ?? true;

    if (id && accepted) {
      updateTaskStatus(id, status);
    }
    hoverState = "idle";
  };

  const dragstart = (event: DragEvent, id: string): void => {
    if (!event.dataTransfer) return;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.setData(currentMimetype, id);
  };

  let newTaskText = $state("");

  const onAddTask = async (): Promise<void> => {
    await addTask(newTaskText.trim(), status);
  };

  let taskToDelete = $state<Task>();

  const onDeleteTask = async (task: Task): Promise<void> => {
    taskToDelete = task;
  };

  const confirmDelete = async (): void => {
    await deleteTask(taskToDelete.id);
    clearTaskToDelete();
  };

  const clearTaskToDelete = (): void => {
    taskToDelete = undefined;
  };
</script>

<vstack gap="2" flex data-testid="swimlane">
  <h2 class="title">{status}</h2>
  <vstack
    gap="2"
    flex
    v-top
    class="swimlane p2 {hoverState}"
    role="list"
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
  >
    {#each items as item (item.id)}
      <div
        role="listitem"
        draggable={true}
        ondragstart={(event: DragEvent) => dragstart(event, item.id)}
        data-testid="draggable-task"
      >
        <TaskCard text={item.text} onDelete={() => onDeleteTask(item)} />
      </div>
    {:else}
      <CardPlaceholder />
    {/each}
    {#if canAdd}
      <TaskInput bind:text={newTaskText} onAdd={onAddTask} />
    {/if}
  </vstack>

  <Modal visible={!!taskToDelete}>
    <vstack gap="3">
      <p><b>Are you sure</b> you want to delete this task?</p>
      <TaskCard text={taskToDelete.text} />
      <hstack gap="2">
        <button secondary onclick={clearTaskToDelete}>Cancel</button>
        <button onclick={confirmDelete}>Delete</button>
      </hstack>
    </vstack>
  </Modal>
</vstack>

<style>
  .swimlane {
    width: 100%;
    min-width: 200px;
    user-select: none;
    overflow: hidden;
    overflow-y: auto;
    padding-bottom: 3rem;
    scrollbar-color: black;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: black;
      border-radius: 3px;
    }
  }

  .title {
    font-weight: 600;
    font-size: var(--font-size-subtitle);
    position: relative;
    align-self: center;
    text-transform: uppercase;
    z-index: 2;
  }

  .title::after {
    content: " ";
    position: absolute;
    left: 4px;
    right: 3px;
    top: 2px;
    bottom: 0;
    transform: rotate(2deg);
    background: var(--color);
    z-index: -1;
    opacity: 0.7;
  }

  .hover,
  .invalid {
    background: rgba(255, 255, 255, 0.5);
    outline: 2px dashed var(--color);
  }

  .invalid {
    position: relative;
    cursor: text;
    opacity: 0.5;
  }

  .invalid > * {
    opacity: 0.65;
  }

  .invalid:after {
    display: block;
    content: "🚫";
    font-size: 40px;
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
</style>
