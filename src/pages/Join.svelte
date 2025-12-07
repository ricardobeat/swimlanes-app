<script lang="ts">
  import { navigate } from "src/router";
  import { loadBoard } from "src/api/board";

  let boardId = $state("");

  async function join(): Promise<void> {
    boardId = boardId.trim();
    if (boardId) {
      await loadBoard(boardId);
      navigate("/board/:boardId", { params: { boardId } });
    }
  }

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === "Enter") {
      join();
    }
  }
</script>

<vstack h-center v-center flex gap="3">
  <h2>Join a board</h2>
  <input
    type="text"
    placeholder="Board access code"
    bind:value={boardId}
    onkeydown={handleKeydown}
  />
  <button onclick={join}>Join</button>
  <p>or <a href="/create">create your own</a></p>
</vstack>

<style>
  h2 {
    font-family: var(--font-header);
    font-size: var(--font-size-subtitle);
  }
  p {
    font-family: var(--font-header);
    font-size: var(--font-size-body);
  }
</style>
