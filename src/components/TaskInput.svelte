<script lang="ts">
  let { text, onAdd } = $props();

  const handleAddTask = (e: KeyboardEvent): void => {
    if (e.key === "Enter" && text.trim()) {
      onAdd();
      text = "";
    }
  };

  const reset = (): void => {
    text = "";
  };
</script>

<input
  class="task-input"
  type="text"
  placeholder="Add task..."
  bind:value={text}
  onkeydown={handleAddTask}
  onblur={reset}
/>

<style>
  .task-input {
    background-color: transparent;
    border-color: var(--color-faded);
    border-style: dotted;
    &::placeholder {
      color: var(--color-faded);
    }
  }
  /*.task-input {
    border: 0;
    background: rgba(255, 255, 255, 0.5);
    padding: var(--u2);
    border-radius: var(--radius-m);
    font-family: var(--font-body);
    width: 100%;
    box-sizing: border-box;
    margin-top: var(--u2);
  }*/

  .task-input:focus {
    /*outline: 2px solid var(--color);*/
    outline: 0;
    border-style: solid;
    background: white;
  }
</style>
