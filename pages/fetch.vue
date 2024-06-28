<template>
  <div class="parent">
    <Chatlist
      :style="{
        transform: `translateX(${chatListVisibility ? 0 : -25}vw)`,
        width: `${chatListVisibility ? 20 : 0}%`,
      }"
      class="chatList"
      :chats="chats"
    />
    <Button
      @click="chatListVisibility = !chatListVisibility"
      class="chatList-hide"
      >Hide</Button
    >
  </div>
</template>

<script setup lang="ts">
import type { transform } from "typescript";
import { type Chat, type ChatContent } from "../db/schema";

let chats = ref<Chat[]>([]);
let chatListVisibility = ref<boolean>(true);

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
.parent {
  display: flex;
  position: absolute;
  inset: 0;
  background-color: #d9d9d9;
}

.chatList {
  transition: all 0.5s;
  display: block;
  width: 20%;
  height: 100%;
  overflow-y: scroll;
}
</style>
