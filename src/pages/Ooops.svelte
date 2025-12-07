<script lang="ts">
  import { navigate, p } from "src/router";
  import { applicationError } from "src/stores/error";

  const restart = (): void => {
    navigate("/");
  };
</script>

<vstack h-center v-center flex gap="3">
  <h2>Ooops... something went wrong.</h2>
  <p><a href={p("/")} onclick={restart}>try again?</a></p>
  <pre>{$applicationError}</pre>
</vstack>

<style>
  h2 {
    font-family: var(--font-header);
    font-weight: 600;
    font-size: var(--font-size-subtitle);
  }
  p {
    font-size: 0.8rem;
  }
  pre {
    margin-top: 10%;
    font-size: 10px;
  }
</style>
