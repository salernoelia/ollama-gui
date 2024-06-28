<template>
  <div class="parent">
    <Chatlist
      :style="{
        transform: `translateX(${chatListVisibility ? 0 : -25}vw)`,
        width: `${chatListVisibility ? 15 : 0}%`,
      }"
      class="chatList"
      :chats="chats"
    />
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
        /></svg
    ></Button>
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
}

.chatList {
  transition: all 0.5s;
  display: block;
  height: 100%;
  overflow-y: scroll;
}
</style>
