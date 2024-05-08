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
                  Choose your model and change the API address in case your's is
                  not the standard one.
                </DialogDescription>
              </DialogHeader>
              <div class="grid gap-4 py-4">
                <div class="flex items-center gap-4">
                  <label for="model" class="text-right w-1/4"> Model </label>
                  <!-- <Input id="model" :value="`${model}`" class="col-span-3" /> -->
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="outline" class="w-full">
                        {{ selectedModel }}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-full">
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
                </div>
                <div class="flex items-center gap-4">
                  <label for="api" class="text-right w-1/4"> API </label>
                  <Input
                    id="api"
                    v-model="api"
                    :value="`${api}`"
                    class="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button @click="deleteChatHistory()">
                  Delete Chat History
                </Button>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { onKeyStroke, promiseTimeout } from "@vueuse/core";
import { useStorage, useScroll } from "@vueuse/core";

const el = ref<HTMLElement | null>(null);

let models = ref([]);

const selectedModel = useStorage("selectedMode", "none");
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
    models.models.length > 0 &&
    models.models[0] &&
    selectedModel.value === "[object Object]"
  ) {
    selectedModel.value = models.models[0].name;
  }
});

const previousAnswers = useStorage("previousAnswers", [""]);

const deleteChatHistory = () => {
  console.log("Deleting chat history");
  console.log(previousAnswers.value);
  previousAnswers.value = [""];
  console.log(previousAnswers.value);
};

const prompt = ref("");
const loading = ref(false); // Loading state

const generate = async () => {
  loading.value = true; // Start loading

  const response = await useFetch(api.value, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      model: selectedModel.value,
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

  previousAnswers.value.push(fullText);

  // wait until the next tick to scroll
  await promiseTimeout(0);

  if (el.value) {
    y.value += el.value?.scrollHeight + 500;
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,300,1,0");

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
  overflow-wrap: break-word;
  line-height: 1;
  white-space: pre-wrap;
}

.code-block code {
  font-size: 12px;
  font-family: monospace;
}
</style>
