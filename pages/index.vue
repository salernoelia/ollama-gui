<template>
  <div class="parent">
    <div class="child">
      <div class="header">
        <div class="header-content">
          <Button variant="destructive" @click="deleteChatHistory()">
            Clear Chat History
            <span class="material-symbols-outlined"> close </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button class="w-full">
                {{ selectedModel }}
                <span class="material-symbols-outlined"> expand_more </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Installed Models</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup>
                <DropdownMenuRadioItem
                  :value="model.name"
                  v-for="model in models.models"
                  @click="selectedModel = model.name"
                >
                  {{ model.name }}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog>
            <DialogTrigger as-child>
              <Button variant="outline">
                <span class="material-symbols-outlined"> settings </span>
              </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>
                  Change the API address in case your's is not the standard one
                  or change the system template.
                </DialogDescription>
              </DialogHeader>
              <div class="grid gap-4 py-4">
                <div class="flex items-center gap-4">
                  <label for="api" class="text-right w-1/4"> API </label>
                  <Input
                    id="api"
                    v-model="api"
                    :value="`${api}`"
                    class="col-span-3"
                    placeholder="Write your API address here."
                  />
                </div>
                <div class="flex items-center gap-4">
                  <label for="api" class="text-right w-1/4"> Template </label>
                  <Input
                    id="systemTemplate"
                    v-model="systemTemplate"
                    :value="`${systemTemplate}`"
                    class="col-span-3"
                    placeholder="Write your system template here."
                  />
                </div>
                <!-- <div class="flex items-center gap-4">
                  <label for="api" class="text-right w-1/4">
                    Temperature
                  </label>
                  <Slider
                    v-bind="temperature"
                    :default-value="[30]"
                    :max="100"
                    :min="0"
                    :step="5"
                  />
                </div> -->
              </div>
              <DialogFooter>
                <Button
                  variant="destructive"
                  @click="
                    () => {
                      api = 'http://localhost:11434/api/generate';
                      selectedModel = models.models[0].name;
                    }
                  "
                >
                  Reset Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div class="actions"></div>
      <div class="answers">
        <div class="answers-content" ref="el">
          <div
            v-for="answer in previousAnswers"
            class="answer-pair"
            :key="answer.date"
          >
            <div
              v-if="
                answer.prompt !== '' &&
                answer.prompt !== null &&
                answer.prompt !== undefined
              "
              class="answer-prompt"
            >
              <p class="date">You, {{ answer.date }}</p>
              <p>
                {{ answer.prompt }}
              </p>
            </div>
            <div
              v-if="
                answer.response !== '' &&
                answer.response !== null &&
                answer.response !== undefined
              "
              class="answer-response"
            >
              <p class="date">
                {{ answer.model }}
              </p>
              <div
                class="markdown-content"
                v-html="marked(answer.response)"
              ></div>
              <button
                @click="
                  () => {
                    copyToClipboard(answer.response);
                  }
                "
                class="answer-response-footer"
              >
                Copy to Clipboard

                <span class="material-symbols-outlined icon-small">
                  content_copy
                </span>
              </button>
            </div>
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
      </div>

      <div>
        <div class="input">
          <Input
            v-model="prompt"
            type="text"
            :placeholder="`Prompt ${selectedModel}`"
          />
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
import { marked } from "marked";

type Models = Model[];

const el = ref<HTMLElement | null>(null);

let models = ref<Models>([]);

let systemTemplate = useStorage("systemTemplate", "");
let seed = useStorage("seed", null);
let temperature = useStorage("temperature", 0.8);
let topP = useStorage("topP", 0.9);
let topK = useStorage("topK", 40);

const selectedModel = useStorage<string>("selectedMode", "none");
const api = useStorage("api", "http://localhost:11434/api/generate");

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

onMounted(async () => {
  if (el.value) {
    y.value += el.value?.scrollHeight + 500;
    console.log(el);
  }

  models = await $fetch("http://localhost:11434/api/tags");

  if (
    selectedModel.value === "none" &&
    models.value.length > 0 &&
    models.value[0] &&
    typeof selectedModel.value === "object"
  ) {
    selectedModel.value = models.value[0].name;
  }
});

const previousAnswers = useStorage("previousAnswers", [
  {
    date: "",
    model: "",
    response: "",
    prompt: "",
  },
]);

const deleteChatHistory = () => {
  console.log("Deleting chat history");
  console.log(previousAnswers.value);
  previousAnswers.value = [{ date: "", model: "", response: "", prompt: "" }];
  console.log(previousAnswers.value);
};

const prompt = ref("");
const loading = ref(false); // Loading state

const generate = async () => {
  loading.value = true; // Start loading

  const response = await useFetch<Response>(api.value, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      model: selectedModel.value,
      prompt: prompt.value,
      system: systemTemplate.value,
      options: {
        seed: seed.value,
        temperature: temperature.value,
        top_p: topP.value,
        top_k: topK.value,
      },
    },
  });

  // Extract text from the Blob object
  const ndjsonText: string = await response.data._rawValue.text();

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

  previousAnswers.value.push({
    date: new Date().toLocaleString(),
    model: selectedModel.value,
    response: fullText,
    prompt: prompt.value.trim(),
  });

  console.log(previousAnswers.value);

  prompt.value = "";

  // wait until the next tick to scroll
  await promiseTimeout(0);

  if (el.value) {
    y.value += el.value?.scrollHeight + 500;
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
</script>

<style>
pre {
  background-color: #f4f4f4;
  padding: 1.2em 1.2em;
  border-radius: 0.3em;
}

code {
  font-family: monospace;
  padding: 0.2em 0.4em;
  border-radius: 0.3em;

  background-color: #f4f4f4;
}

ul,
li {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,300,1,0");

* {
  scroll-behavior: smooth;
}

.parent {
  display: flex;
  position: absolute;
  inset: 0;
  justify-content: center;
}

.child {
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 60rem;
}

.header {
  display: flex;
  height: 3.5rem;
  justify-content: flex-end;
  gap: 1em;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1em;
}

.header-content {
  display: flex;
  gap: 1em;
  justify-content: center;
  align-items: center;
  border-radius: 0.5em;
}

.input {
  display: flex;
  gap: 1em;
  margin: 30px 50px 50px 50px;
  justify-content: center;
  align-items: center;
  border-radius: 0.5em;
}

.loading {
  display: flex;
}

.answers {
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Align items to the top */
  margin: 50px 50px 0 50px;
  border-radius: 0.5em;
  height: 100%;

  overflow-y: scroll; /* Add scrollbar when content exceeds container height */
  overflow-x: scroll;
}

.answers-content {
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  height: auto;
  gap: 1.2em;
  padding-right: 1em;

  overflow-y: scroll; /* Add scrollbar when content exceeds container height */
  overflow-x: scroll;
}
.answer-pair {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.answer-block {
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 0.5em;
}

.answer-response {
  padding: 10px;

  display: flex;
  flex-direction: column;
  gap: 1em;
  font-size: 14px;
  border-radius: 0.5em;
  overflow: auto;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  .date {
    font-size: 12px;
    color: #1b1b1b;
  }

  .answer-response-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .icon-small {
    font-size: 16px;
  }
}

.markdown-content {
  font-size: 14px;
  border-radius: 0.5em;
  overflow: auto;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  margin: 0;
  height: 100%;
  scrollbar-width: none;
}

.answer-prompt {
  padding: 10px;
  color: white;
  background-color: #000000;
  font-size: 14px;
  border-radius: 0.5em;
  overflow: auto;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  .date {
    font-size: 12px;
    color: #ccc;
  }
}

#systemTemplate {
  overflow: auto;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}
</style>
