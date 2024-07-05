<template>
  <div class="parent">
    <div class="chatList">
      <div
        class="body"
        :style="{
          backgroundColor: colorMode.value === 'dark' ? '#1a1a1a' : '#fbfbfb',
        }"
      >
        <div class="button-container">
          <!-- <DialogTrigger >
            New Chat
          
          </DialogTrigger>

          <Dialog>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter "> New Chat </DialogFooter>
            </DialogContent>
          </Dialog> -->
          <Dialog>
            <DialogTrigger as-child>
              <Button class="new-chat-button"
                >New Chat
                <Icon
                  icon="radix-icons:plus"
                  class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-1"
              /></Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a new Chat</DialogTitle>
                <DialogDescription>
                  Enter the name of the chat you want to create.
                </DialogDescription>
              </DialogHeader>
              <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                  <label for="name" class="text-right"> Chat name </label>
                  <Input v-model="newChatName" id="name" class="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose as-child>
                  <Button @click="$emit('newChat', newChatName)">
                    Create
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

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
import { type Chat } from "../db/schema";
import { Icon } from "@iconify/vue";

const colorMode = useColorMode();
const newChatName = ref("New Chat");

defineProps({
  currentChatId: {
    type: Number,
    required: true,
  },
  chats: {
    type: Array as unknown as PropType<Chat[]>,
    required: true,
  },
});
</script>

<style scoped>
.chatList {
  transition: all 0.5s;
  height: 100%;
  overflow-y: scroll;
  padding-top: 10px;
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

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 10px;
}

.new-chat-button {
  display: flex;
  gap: 4px;
  width: 100%;
}
</style>
