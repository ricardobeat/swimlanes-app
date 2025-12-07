<script>
  import Swimlane from "src/components/Swimlane.svelte";
  import { loadBoard } from "src/api/board";
  import { subscribeToBoard } from "./Board/stream";
  import { route } from "src/router";

  $effect(() => {
    const { boardId } = route.params;
    loadBoard(boardId);
    const sub = subscribeToBoard(boardId);
    return () => sub.unsubscribe();
  });
</script>

<hstack flex gap="2">
  <Swimlane name="todo" accept={[]} canAdd --color="var(--color-accent-1)" />
  <Swimlane name="ongoing" --color="var(--color-accent-2)" />
  <Swimlane name="done" accept={["ongoing"]} --color="var(--color-accent-3)" />
  <hstack h-left class="actions">
    <a href="/" class="join-link">join another board</a>
  </hstack>
</hstack>

<style>
  .actions {
    position: absolute;
    bottom: var(--u3);
    left: var(--u4);
  }
  .join-link {
    font-family: var(--font-header);
    font-size: 0.8rem;
  }
</style>
