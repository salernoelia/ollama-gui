<template>
  <div class="parent">
    <div class="child">
      <div class="actions"></div>
      <div class="answers" ref="el">
        <div v-for="answer in previousAnswers" :key="answer">
          <pre
            v-if="answer !== ''"
            class="code-block"
          ><code>{{ answer }}</code></pre>
        </div>
        <div class="loading" v-if="loading">
          <Alert>
            <AlertTitle>Currently generating...</AlertTitle>
            <AlertDescription>
              Please wait while the AI generates a response.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <div>
        <div class="input">
          <Input v-model="prompt" type="text" placeholder="Prompt" />
          <Button
            @click="
              () => {
                generate();
              }
            "
            >Generate</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onKeyStroke, promiseTimeout } from "@vueuse/core";
import { useStorage, useScroll } from "@vueuse/core";

const el = ref<HTMLElement | null>(null);

const { x, y, isScrolling, arrivedState, directions } = useScroll(
  el,

  {
    behavior: "smooth",
  }
);

onKeyStroke(["Enter"], (e) => {
  e.preventDefault();
  generate();
});

const previousAnswers = useStorage("previousAnswers", [""]);

const prompt = ref("");
const loading = ref(false); // Loading state

const generate = async () => {
  loading.value = true; // Start loading
  const response = await useFetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      model: "llama3",
      prompt: prompt.value,
      max_tokens: 1,
      temperature: 0,
      safe_mode: false,
      usage: {
        completion_tokens: 1,
        max_tokens: 1,
      },
    },
  });
  prompt.value = "";

  // Extract text from the Blob object
  const ndjsonText = await response.data._rawValue.text();

  // Split the NDJSON text into lines
  const lines = ndjsonText.split("\n");

  // Parse each line as JSON and extract the 'response' field
  let fullText = "";
  for (const line of lines) {
    if (line.trim() !== "") {
      const obj = JSON.parse(line);
      fullText += obj.response;
    }
  }

  loading.value = false; // End loading

  previousAnswers.value.push(fullText);

  // wait until the next tick to scroll
  await promiseTimeout(0);

  if (el.value) {
    y.value += el.value?.scrollHeight + 500;
    console.log(el);
  }
};
</script>

<style scoped>
.parent {
  display: flex;
  position: absolute;
  inset: 0;
  justify-content: left;
  align-items: left;
}

.child {
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  gap: 1em;
  width: 100%;
}

.input {
  display: flex;

  gap: 1em;
  margin: 50px;

  justify-content: center;
  align-items: center;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 0.5em;
}

.loading {
  display: flex;
}

.answers {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 25px;

  height: 100%;
  margin: 50px 50px 0 50px;

  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 0.5em;

  gap: 1em;
}

.answer-block {
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 0.5em;
  overflow: none;
}

.code-block {
  border: 2px solid #ddd;
  padding: 10px;
  font-size: 14px;
  font-family: monospace;
  border-radius: 0.5em;
  overflow: auto;
}
.code-block code {
  font-size: 12px;

  font-family: monospace;
}
</style>
