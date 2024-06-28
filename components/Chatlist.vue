<template>
  <div class="body">
    <div class="chat-preview-list" v-for="chat in chats" :key="chat.id">
      <div class="chat-preview-container">
        <p>{{ chat.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Chat, type ChatContent } from "../db/schema";

defineProps({
  chats: {
    type: Array as PropType<Chat[]>,
    required: true,
  },
});
</script>

<style scoped>
.body {
  background-color: #fbfbfb;
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
  color: #191919;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #d9d9d9;
  }
}
</style>
