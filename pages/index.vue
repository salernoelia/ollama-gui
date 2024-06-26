<template>
  <Toaster />

  <div class="parent">
    <div class="child">
      <div class="header">
        <div class="header-content">
          <Button
            variant="destructive"
            @click="
              deleteChatHistory();
              toast({
                variant: 'destructive',
                title: 'Chat has been cleared',
                duration: 1500,
              });
            "
          >
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
                  v-for="model in models"
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
                  Change the Port in case your's is not the standard one or
                  change the system template.
                </DialogDescription>
              </DialogHeader>
              <div class="grid gap-4 py-4">
                <div class="flex items-center gap-4">
                  <label for="port" class="text-right w-1/4"> Port </label>
                  <Input
                    id="port"
                    v-model="port"
                    :value="`${port}`"
                    class="col-span-3"
                    type="number"
                    variant="outline"
                    placeholder="Write the Port where Ollama is running"
                  />
                </div>
                <div class="flex items-center gap-4">
                  <label for="api" class="text-right w-1/4"> Template </label>
                  <Textarea
                    id="systemTemplate"
                    v-model="systemTemplate"
                    :value="`${systemTemplate}`"
                    class="col-span-3"
                    placeholder="Write your system template here."
                  />
                </div>
                <div class="flex items-center gap-4">
                  <label for="api" class="text-right w-1/4"> Seed </label>
                  <Input
                    id="seed"
                    v-model="seed"
                    :value="`${seed}`"
                    class="col-span-3"
                    placeholder="Write your system template here."
                  />
                </div>
                <div class="flex items-center gap-4">
                  <label for="api" class="text-right w-1/4"> Temp </label>
                  <input
                    type="range"
                    v-model="temperature"
                    min="0"
                    max="1"
                    step="0.1"
                    class="slider"
                    id="temperature"
                  />
                  <span class="slider-label">{{ temperature }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <label for="api" class="text-right w-1/4"> Top K </label>
                  <input
                    type="range"
                    v-model="topK"
                    min="1"
                    max="100"
                    step="1"
                    class="slider"
                    id="topK"
                  />
                  <span class="slider-label">{{ topK }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <label for="api" class="text-right w-1/4"> Top P </label>
                  <input
                    type="range"
                    v-model="topP"
                    min="0.5"
                    max="0.95"
                    step="0.05"
                    class="slider"
                    id="topP"
                  />
                  <span class="slider-label">{{ topP }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <label for="api" class="text-right w-1/4">
                    Chat Memory
                  </label>
                  <input
                    type="range"
                    v-model="contextAmount"
                    min="1"
                    max="40"
                    step="1"
                    class="slider"
                    id="contextAmount"
                  />
                  <span class="slider-label">{{ contextAmount }}</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="destructive" @click="resetSettings">
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
          <div v-for="chat in context" class="chat-pair" :key="chat.date">
            <div
              v-if="
                chat.role !== '' &&
                chat.role !== null &&
                chat.role !== undefined &&
                chat.role === 'user'
              "
              class="prompt"
            >
              <p class="date">You, {{ chat.date }}</p>
              <p>
                {{ chat.content }}
              </p>
            </div>
            <div
              v-if="
                chat.role !== '' &&
                chat.role !== null &&
                chat.role !== undefined &&
                chat.role === 'assistant'
              "
              class="response"
            >
              <p class="date">
                {{ chat.model }}
              </p>
              <div class="markdown-content" v-html="marked(chat.content)"></div>

              <button
                @click="
                  () => {
                    copyToClipboard(chat.content);
                    toast({
                      title: 'Message copied to clipboard',
                      duration: 1500,
                    });
                  }
                "
                class="response-footer"
              >
                Copy to Clipboard

                <span class="material-symbols-outlined icon-small">
                  content_copy
                </span>
              </button>
            </div>
          </div>
          <div v-if="loading">
            <p class="date">
              {{ streamingModel }}
            </p>

            <div
              class="markdown-content"
              v-html="marked(streamingResponse)"
            ></div>
          </div>
        </div>
      </div>

      <div>
        <div class="input">
          <Input
            v-model="prompt"
            type="text"
            :placeholder="`Prompt ${selectedModel}`"
            :disabled="!ollamaLoaded"
          />
          <Button :disabled="!ollamaLoaded" @click="generate">Generate</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onKeyStroke, promiseTimeout } from "@vueuse/core";
import { useStorage, useScroll } from "@vueuse/core";
import { marked } from "marked";

import { ToastAction } from "@/components/ui/toast";
import { onMounted } from "vue";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";

const { toast } = useToast();

const el = ref<HTMLElement | null>(null);

let models: Model[] = [];
let message = ref<string>("");

let streamingModel = ref<string>("");
let streamingResponse = ref<string>("");

let ollamaLoaded = ref<boolean>(false);

// User Settings
let port = useStorage("port", 11434);
let systemTemplate = useStorage("systemTemplate", "");
let seed = useStorage("seed", 0);
let temperature = useStorage("temperature", 0.8);
let topP = useStorage("topP", 0.9);
let topK = useStorage("topK", 40);
let contextAmount = useStorage("contextAmount", 10);
const selectedModel = useStorage<string>("selectedMode", "none");

// Chat History
interface Context {
  date: string;
  role: string;
  content: string;
  model?: string;
}

let context = useStorage<Context[]>("context", []);

let api = computed(() => `http://localhost:${port.value}`);

function reloadWindow() {
  window.location.reload();
}

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

function checkOllamaRunning() {
  fetch(api.value)
    .then((response) => {
      if (response.status === 200) {
        ollamaLoaded.value = true;
      } else {
        ollamaLoaded.value = false;
      }
    })
    .catch((error) => {
      ollamaLoaded.value = false;
      toast({
        variant: "destructive",
        title:
          "Cannot connect to Ollama! Is it running on port" + port.value + "?",
        duration: 15000,
        action: h(
          ToastAction,
          {
            altText: "Try again",
            onClick: reloadWindow, // Pass the reloadWindow function here
          },
          {
            default: () => "Try again",
          }
        ),
      });
    });
}

async function fetchTags() {
  try {
    const response = await $fetch<ModelsFetchResponse>(api.value + "/api/tags");

    response.models.forEach((model) => {
      models.push(model);
    });

    console.log("current model", selectedModel.value);

    if (models.length == 0) {
      toast({
        variant: "destructive",
        title: "No models found, try restarting Ollama!",
        duration: 3000,
      });

      return;
    }

    if (selectedModel.value === "none" && models.length > 0 && models[0]) {
      selectedModel.value = models[0].name;
    }
    ollamaLoaded.value = true;
    console.log("Olama loaded", ollamaLoaded.value);

    return;
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Error fetching models! Is Ollama running?",
      duration: 15000,
      action: h(
        ToastAction,
        {
          altText: "Try again",
          onClick: reloadWindow, // Pass the reloadWindow function here
        },
        {
          default: () => "Try again",
        }
      ),
    });

    ollamaLoaded.value = false;
    console.error("Error fetching models", error);

    return;
  }
}

const resetSettings = () => {
  {
    port.value = 11434;
    selectedModel.value = models[0].name;
    systemTemplate.value = "";
    seed.value = 0;
    temperature.value = 0.8;
    topP.value = 0.9;
    topK.value = 40;
    contextAmount.value = 10;

    toast({
      variant: "destructive",
      title: "Settings reset to default values",
      duration: 3000,
    });
  }
};

onMounted(async () => {
  if (el.value) {
    y.value += el.value?.scrollHeight + 500;
  }

  fetchTags();
});

const deleteChatHistory = () => {
  context.value = [];

  message.value = "";
  streamingModel.value = "";
  streamingResponse.value = "";
  prompt.value = "";
};

const prompt = ref("");
const loading = ref(false);
let temporaryPrompt = "";

const generate = async () => {
  checkOllamaRunning();

  if (!ollamaLoaded.value) {
    return;
  }
  temporaryPrompt = prompt.value;
  prompt.value = "";
  toast({
    title: "Generating response...",
    duration: 3000,
  });

  console.log(
    "context",
    context.value,
    contextAmount.value,
    context.value.length
  );

  const response = await fetch(api.value + "/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: selectedModel.value,
      messages: [
        ...context.value //only take the contextAmount  of last messages without deleting the rest
          .slice(-contextAmount.value * 2)
          .map((message) => ({
            role: message.role,
            content: message.content,
          })),
        {
          role: "user",
          content: temporaryPrompt,
        },
        {
          role: "system",
          content: systemTemplate.value,
        },
      ],

      stream: true, // Set stream to true
      options: {
        seed: Number(seed.value),
        temperature: Number(temperature.value),
        top_p: Number(topP.value),
        top_k: Number(topK.value),
      },
    }),
  });

  const reader = response.body ? response.body.getReader() : null;
  const decoder = new TextDecoder();

  let partialMessage = "";
  message.value = "";
  streamingResponse.value = "";
  let model = "";
  let role;
  loading.value = true;

  while (true) {
    const { done, value } = reader
      ? await reader.read()
      : { done: true, value: null };
    if (done) break;

    const chunk = value ? decoder.decode(value, { stream: true }) : "";

    // Combine the current chunk with any leftover partial message
    const combinedChunk = partialMessage + chunk;

    // Split the combined chunk by newline characters to separate individual JSON objects
    const jsonObjects = combinedChunk.split("\n");

    if (!model && !role) {
      const firstJsonObject = jsonObjects[0];
      try {
        const parsedObject = JSON.parse(firstJsonObject);

        model = parsedObject.model;
        streamingModel.value = model;
        role = parsedObject.message?.role;
      } catch (error) {
        // If parsing fails, it means the chunk might be incomplete, so we save it for the next iteration
        partialMessage = firstJsonObject;
      }
    }

    // Iterate through each JSON object and extract the "content" field
    for (const jsonObject of jsonObjects) {
      try {
        const parsedObject = JSON.parse(jsonObject);
        if (parsedObject.message && parsedObject.message.content) {
          if (el.value) {
            y.value += el.value?.scrollHeight + 500;
          }
          streamingResponse.value += parsedObject.message.content;
          message.value += parsedObject.message.content;
        }
      } catch (error) {
        // If parsing fails, it means the chunk might be incomplete, so we save it for the next iteration
        partialMessage = jsonObject;
      }
    }
  }

  loading.value = false; // End loading

  context.value.push({
    date: new Date().toLocaleString(),
    role: "user",
    content: temporaryPrompt,
  });

  context.value.push({
    date: new Date().toLocaleString(),
    role: "assistant",
    content: message.value,
    model: model,
  });

  console.log(
    "context",
    context.value,
    contextAmount.value,
    context.value.length
  );

  temporaryPrompt = "";
  message.value = "";

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

  overflow-y: hidden; /* Add scrollbar when content exceeds container height */
}

.answers-content {
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  height: auto;
  gap: 1.2em;
  padding-right: 1em;

  overflow-y: scroll; /* Add scrollbar when content exceeds container height */
  overflow-x: hidden;
}
.chat-pair {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.answer-block {
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 0.5em;
}

.date {
  font-size: 12px;
  color: #1b1b1b;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #000000;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #000000;
    cursor: pointer;
  }
}

.slider-label {
  width: 50px;
  text-align: right;
}

.response {
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

  .response-footer {
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

.prompt {
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
