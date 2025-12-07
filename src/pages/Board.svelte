<script lang="ts">
  import Swimlane from "src/components/Swimlane.svelte";
  import Modal from "src/components/Modal.svelte";
  import InviteCode from "src/components/InviteCode.svelte";
  import { loadBoard } from "src/api/board";
  import { subscribeToBoard } from "./Board/stream";
  import { route, p } from "src/router";

  const { boardId } = route.params;

  $effect(() => {
    loadBoard(boardId);
    const sub = subscribeToBoard(boardId);
    return () => sub.unsubscribe();
  });

  let showCode = $state(false);
  const showInviteCode = (e: MouseEvent): void => {
    e.preventDefault();
    showCode = true;
  };
</script>

<hstack flex gap="2" class="board" h-center v-top>
  <hstack class="lanes" gap="3">
    <Swimlane status="todo" accept={[]} canAdd --color="var(--color-accent-1)" />
    <Swimlane status="ongoing" --color="var(--color-accent-2)" />
    <Swimlane status="done" accept={["ongoing"]} --color="var(--color-accent-3)" />
  </hstack>
  <div class="actions">
    <a href="##share" onclick={showInviteCode}>share</a> |
    <a href={p("/")} class="join-link">join another board</a>
  </div>
  <Modal bind:visible={showCode}>
    <vstack gap="2" class="block pv3 ph4">
      <p class="share-title">Sharing code:</p>
      <InviteCode code={boardId} />
    </vstack>
  </Modal>
</hstack>

<style>
  .board {
    height: 100%;
    overflow: hidden;
  }
  .lanes {
    margin-bottom: var(--u4);
    overflow: hidden;
  }
  .actions {
    position: absolute;
    bottom: var(--u3);
    left: var(--u4);
  }
  .actions {
    font-family: var(--font-header);
    font-size: 0.8rem;
  }
  .share-title {
    font-family: var(--font-header);
  }
</style>
