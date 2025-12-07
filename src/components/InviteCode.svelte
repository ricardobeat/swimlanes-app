<script lang="ts">
  let { code }: { code: string } = $props();

  let copied = $state(false);
  let copiedTimer = $state<ReturnType<typeof setTimeout>>();

  const copy = (e: MouseEvent): void => {
    const el = e.target as HTMLInputElement;
    el.select();
    navigator.clipboard.writeText(el.value);
    copied = true;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied = false), 2000);
  };
</script>

<vstack gap="2" h-center>
  <input class="block" readonly value={code} onclick={copy} />
  <p>{copied ? "Copied to clipboard!" : "Click to copy"}</p>
</vstack>

<style>
  input {
    background-color: var(--color-background);
    outline: 0 !important;
  }
  p {
    font-size: 0.8rem;
    color: var(--color-text);
  }
</style>
