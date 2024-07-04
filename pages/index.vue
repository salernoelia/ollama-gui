<template>
  <Toaster />

  <div class="parent">
    <div class="child">
      <Sidebar
        :currentChatId="currentChatID"
        :chats="chatList"
        :style="{
          transform: `translateX(${chatListVisibility ? 0 : -25}vw)`,
          width: `${chatListVisibility ? 15 : 0}%`,
          backgroundColor:
            colorMode.preference === 'dark' ? '#1a1a1a' : '#fbfbfb',
        }"
        class="sidebar"
        @changeChat="changeChat"
        @newChat="createNewChat"
      />
      <div class="chat-body">
        <div class="header">
          <div class="header-content">
            <div class="header-left">
              <Button
                @click="chatListVisibility = !chatListVisibility"
                class="chatList-hide"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m6 2v14h11V5z"
                  />
                </svg>
              </Button>
            </div>
            <div class="header-right">
              <Button
                variant="destructive"
                @click="
                  deleteChat(currentChatID);
                  toast({
                    variant: 'destructive',
                    title: 'Chat has been deleted',
                    duration: 1500,
                  });
                "
              >
                Delete Chat
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
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="outline">
                    <Icon
                      icon="radix-icons:moon"
                      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                    />
                    <Icon
                      icon="radix-icons:sun"
                      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                    />
                    <span class="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click="colorMode.preference = 'light'">
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="colorMode.preference = 'dark'">
                    Dark
                  </DropdownMenuItem>
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
                      <label for="api" class="text-right w-1/4">
                        Template
                      </label>
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
        </div>

        <div class="chat-innerbody">
          <div class="actions"></div>
          <div class="answers">
            <div class="answers-content" ref="el">
              <div
                v-for="chat in currentChatContent"
                class="chat-pair"
                :key="chat.date"
              >
                <div
                  v-if="
                    chat.role !== '' &&
                    chat.role !== null &&
                    chat.role !== undefined &&
                    chat.role === 'user'
                  "
                  class="prompt"
                  :style="[
                    {
                      'background-color':
                        colorMode.preference === 'dark' ? '#333333' : '#fbfbfb',
                    },
                    {
                      color:
                        colorMode.preference === 'dark' ? '#ffffff' : '#000000',
                    },
                  ]"
                >
                  <p
                    :style="{
                      color:
                        colorMode.preference === 'dark' ? '#ccc' : '#000000',
                    }"
                    class="date"
                  >
                    You, {{ chat.date }}
                  </p>
                  <p>
                    {{ chat.content }}
                  </p>
                  <div
                    style="
                      display: flex;
                      justify-content: end;
                      align-items: center;
                    "
                  >
                    <button
                      class="response-footer-button"
                      @click="
                        () => {
                          copyToClipboard(chat.content);
                          toast({
                            title: 'Message copied to clipboard',
                            duration: 1500,
                          });
                        }
                      "
                    >
                      Copy to Clipboard

                      <span
                        class="material-symbols-outlined"
                        style="font-size: 16px"
                      >
                        content_copy
                      </span>
                    </button>
                  </div>
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
                  <p
                    class="date"
                    :style="
                      colorMode.preference === 'dark'
                        ? 'color: #ccc'
                        : 'color: #1b1b1b'
                    "
                  >
                    {{ chat.model }}
                  </p>
                  <div
                    class="markdown-content"
                    v-html="marked(chat.content)"
                  ></div>

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
                :style="
                  colorMode.preference === 'dark'
                    ? 'background-color: #333333'
                    : 'background-color: #fbfbfb'
                "
              />
              <Button :disabled="!ollamaLoaded" @click="generate"
                >Generate</Button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onKeyStroke, promiseTimeout } from "@vueuse/core";
import { useStorage, useScroll } from "@vueuse/core";
import { marked } from "marked";
import {
  type FetchedChat,
  type Chat,
  type ChatAttributes,
  type ChatContent,
  type FetchedChats,
} from "../db/schema";

const router = useRoute();

import { ToastAction } from "@/components/ui/toast";
import { Icon } from "@iconify/vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { onMounted } from "vue";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";

const colorMode = useColorMode();

const { toast } = useToast();

const el = ref<HTMLElement | null>(null);

let models: Model[] = [];
let message = ref<string>("");

let streamingModel = ref<string>("");
let streamingResponse = ref<string>("");

let ollamaLoaded = ref<boolean>(false);

// User Settings
let chatListVisibility = ref<boolean>(true);
let port = useStorage("port", 11434);
let systemTemplate = useStorage("systemTemplate", "");
let seed = useStorage("seed", 0);
let temperature = useStorage("temperature", 0.8);
let topP = useStorage("topP", 0.9);
let topK = useStorage("topK", 40);
let contextAmount = useStorage("contextAmount", 10);
const selectedModel = useStorage<string>("selectedMode", "none");
let currentUserID = useStorage("currentUserID", 1);

// Chats
let currentChatID = useStorage("currentChat", 1);
let chatList = ref<Chat[]>([]);
let currentChatData = ref<Chat>();
let currentChatContent = ref<ChatAttributes[]>();

let context = useStorage<ChatContent[]>("context", []);
// let context = $fetch<ChatAttributes[]>(
//   `http://localhost:3000/api/chats/${currentChat.value}`
// );

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

function changeChat(chatID: number) {
  currentChatID.value = chatID;
  fetchCurrentChat();
}

const fetchChats = async () => {
  let response = await $fetch<FetchedChats>("/api/chats");
  chatList.value = response.chats.sort((a, b) => b.id - a.id);
};

const fetchCurrentChat = async () => {
  const data = await $fetch<FetchedChat>(
    `http://localhost:3000/api/chats/${currentChatID.value}`
  );

  currentChatData.value = data.chats;
  currentChatContent.value = data.chats.content;
};
const createNewChat = async () => {
  try {
    const response = await $fetch<Chat>(`http://localhost:3000/api/chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "New Chat",
        content: [],
        userID: currentUserID.value,
      }),
    });

    await fetchChats();
    console.log("New chat created", response);
    changeChat(chatList.value[0].id);
  } catch (error) {
    console.error("Error creating new chat", error);
  }
};

const deleteChat = async (id: number) => {
  try {
    const respone = await $fetch<Chat>(
      `http://localhost:3000/api/chats/${id}`,
      {
        method: "DELETE",
      }
    );
    await fetchChats();
    console.log("Chat deleted", id, respone);

    currentChatID.value = chatList.value[0].id;
    changeChat(currentChatID.value);
  } catch (error) {
    console.error("Error deleting chat", error);
  }
};

const updateChat = async <ChatAttributes>(
  id: number,
  content: ChatContent[]
) => {
  try {
    $fetch<ChatAttributes>(
      `http://localhost:3000/api/chats/${currentChatID.value}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: new Date().toLocaleString(),
          role: role,
          content: content,
          model: model,
        }),
      }
    );
    console.log("Context added to chat");
  } catch (error) {
    console.error("Error adding context to chat", error);
  }
};

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

  fetchChats();
  fetchCurrentChat();
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

  updateChat(currentChatID.value, context.value);

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
  padding: 1.2em 1.2em;
  border-radius: 0.3em;
  overflow-x: scroll;
  width: 100%;
  background-color: #1f1f1f;
  color: #f4f4f4;
}

code {
  font-family: monospace;
  padding: 0.2em 0.4em;
  border-radius: 0.3em;
  overflow-wrap: break-word;
  width: 100%;
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
  flex-direction: row;
  position: absolute;
  inset: 0;
  justify-content: center;
}

.child {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.chat-body {
  display: flex;
  flex-direction: column;
  gap: 1em;

  overflow-y: scroll;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.chat-innerbody {
  display: flex;
  flex-direction: column;
  gap: 1em;
  height: 100%;
  overflow-y: scroll;
  width: 80%;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1em;
  border-right: 1px solid #ccc;
  position: relative;
  height: 100%;
  overflow-y: scroll;
  transition: all 0.5s;
}

.header {
  display: flex;
  height: 3.5rem;
  justify-content: flex-end;
  gap: 1em;
  width: 100%;
  padding: 1em;
}

.header-content {
  display: flex;
  gap: 1em;

  border-radius: 0.5em;
  width: 100%;
}

.header-left {
  display: flex;
  gap: 1em;
  align-items: start;
  width: 100%;
}

.header-right {
  display: flex;
  gap: 1em;
  align-items: start;
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
  scrollbar-width: none;

  padding-right: 1em;

  overflow-y: scroll; /* Add scrollbar when content exceeds container height */
  overflow-x: hidden;
}
.chat-pair {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: flex-end;
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
  width: 100%;

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
    justify-content: end;
  }

  .response-footer-button {
    display: flex;
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
  text-align: left;
  padding: 10px;
  color: #1b1b1b;
  font-size: 14px;
  border-radius: 0.5em;
  overflow: none;
  width: 60%;

  overflow-wrap: break-word;
  white-space: pre-wrap;
  .date {
    font-size: 12px;
    color: #1b1b1b;
  }
}

#systemTemplate {
  overflow: auto;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}
</style>
