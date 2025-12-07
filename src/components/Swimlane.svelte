<script lang="ts">
  import Card from "./Card.svelte";
  import CardPlaceholder from "./CardPlaceholder.svelte";
  import { tasks, MT_PREFIX, type Task } from "../stores/tasks.js";

  interface Props {
    accept: string[];
    name: Task["status"];
  }

  let { name, accept }: Props = $props();

  let currentMimetype = $derived(MT_PREFIX + name);
  let items = $derived($tasks.filter((task) => task.status === name));
  let hoverState = $state<"idle" | "hover" | "invalid">("idle");

  function parseStatus(mimetype: string): string {
    return mimetype.split(MT_PREFIX)[1];
  }

  const handleDragOver = (event: DragEvent): void => {
    if (!event.dataTransfer) return;

    const sourceStatus = parseStatus(event.dataTransfer.types[0]);
    const accepted = accept?.includes(sourceStatus) ?? true;

    // don't show hover state when dragging over the source lane
    if (sourceStatus === name) {
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
      /**
       * why do this instead of .map()?
       * since all tasks are in one array, this makes
       * it show up at the bottom of whatever new status
       * it was moved to.
       */
      const theTask = $tasks.find((t) => t.id === id);
      const newTasks = $tasks.filter((t) => t.id !== id);
      $tasks = [...newTasks, { ...theTask, status: name }];
    }
    hoverState = "idle";
  };

  const dragstart = (event: DragEvent, id: string): void => {
    if (!event.dataTransfer) return;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.setData(currentMimetype, id);
  };
</script>

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
  <h2 class="title">{name}</h2>
  {#each items as item (item.id)}
    <div
      role="listitem"
      draggable={true}
      ondragstart={(event) => dragstart(event, item.id)}
    >
      <Card text={item.text} />
    </div>
  {:else}
    <CardPlaceholder />
  {/each}
</vstack>

<style>
  .swimlane {
    max-width: 320px;
    align-self: stretch;
    user-select: none;
  }

  .title {
    font-weight: 600;
    font-size: var(--font-size-subtitle);
    position: relative;
    align-self: start;
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
