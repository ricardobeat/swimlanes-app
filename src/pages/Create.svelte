<script lang="ts">
  import { navigate } from "src/router";
  import { createBoard } from "src/api/board";
  import Spinner from "src/components/Spinner.svelte";
  import { applicationError } from "src/stores/error";

  // This page serves as a loading page during board creation.
  // It redirects to the board once it's created succesfully on the server.

  $effect(() => {
    // Add an artificial delay to make sure the animation has time to play a little bit
    const delay = (n: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, n));
    Promise.all([createBoard(), delay(1200)])
      .then(([board]) => {
        const boardId = board.id;
        navigate("/board/:boardId", { params: { boardId } });
      })
      .catch((e) => {
        $applicationError = e;
        navigate("/error");
      });
  });
</script>

<vstack h-center v-center flex gap="3">
  <Spinner />
  <h2>Creating board...</h2>
</vstack>

<style>
  h2 {
    font-family: var(--font-header);
    font-size: var(--font-size-subtitle);
  }
</style>
