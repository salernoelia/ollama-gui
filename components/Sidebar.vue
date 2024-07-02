<template>
  <div class="parent">
    <div class="chatList">
      <div
        class="body"
        :style="{
          backgroundColor: colorMode.value === 'dark' ? '#1a1a1a' : '#fbfbfb',
        }"
      >
        <div class="chat-preview-list" v-for="chat in chats" :key="chat.id">
          <div
            :style="{
              backgroundColor:
                chat.id === currentChatId ? '#d9d9d9' : 'transparent',
              color:
                chat.id === currentChatId
                  ? '#191919'
                  : colorMode.value === 'dark'
                  ? '#d9d9d9'
                  : '#191919',
            }"
            @click="$emit('changeChat', chat.id)"
            class="chat-preview-container"
          >
            <p>{{ chat.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { transform } from "typescript";
import { type Chat, type ChatContent } from "../db/schema";

const colorMode = useColorMode();

let chats = ref<Chat[]>([]);

defineProps({
  currentChatId: {
    type: Number,
    required: true,
  },
});

interface FetchChats {
  chats: Chat[];
}

const fetchChats = async () => {
  let response = await $fetch<FetchChats>("/api/chats");
  console.log(response);

  chats.value = response.chats;
  console.log(chats.value);
};

fetchChats();
</script>

<style scoped>
.chatList {
  transition: all 0.5s;
  height: 100%;
  overflow-y: scroll;
}

.chat-preview-list {
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 10px;
}

.chat-preview-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
  padding: 10px;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #d9d9d9;
  }
}
</style>
