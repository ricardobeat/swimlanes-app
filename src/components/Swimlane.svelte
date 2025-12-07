<script lang="ts">
  import Card from "./Card.svelte";
  import CardPlaceholder from "./CardPlaceholder.svelte";
  import { tasks, MT_PREFIX } from "../stores/tasks.js";

  interface Props {
    accept: string[];
    name: string;
  }

  let { name, accept }: Props = $props();

  let currentMimetype = $derived(MT_PREFIX + name);

  function parseStatus(mimetype: string): string {
    return mimetype.split(MT_PREFIX)[1];
  }

  let items = $derived($tasks.filter((task) => task.status === name));
  let hoverState = $state<"idle" | "hover" | "invalid">("idle");

  const handleDragOver = (event: DragEvent): void => {
    const sourceStatus = parseStatus(event.dataTransfer.types[0]);
    const accepted = accept?.includes(sourceStatus) ?? true;
    // don't show hover state for source lane
    if (sourceStatus === name) {
      return;
    }

    if (accepted) {
      hoverState = "hover";
      event.preventDefault();
    } else {
      hoverState = "invalid";
      console.log(event);
      const ghost = event.currentTarget.cloneNode(true);
      ghost.style.cssText = "position: absolute; top: -1000px;";
      document.body.appendChild(ghost);
      event.dataTransfer.setDragImage(ghost, 10, 10);
    }
  };

  const handleDragLeave = (): void => {
    hoverState = "idle";
  };

  const handleDrop = (event: DragEvent): void => {
    event.preventDefault();
    const mimetype = event.dataTransfer.types[0];
    const sourceStatus = parseStatus(mimetype);
    const id = event.dataTransfer?.getData(mimetype);
    const accepted = accept?.includes(sourceStatus) ?? true;

    if (id && accepted) {
      tasks.update((currentTasks) => {
        return currentTasks.map((task) =>
          task.id === id ? { ...task, status: name } : task,
        );
      });
    }
    hoverState = "idle";
  };

  const dragstart = (event: DragEvent, id: string): void => {
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
    position: relative;
    align-self: start;
    text-transform: uppercase;
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
  }
</style>
