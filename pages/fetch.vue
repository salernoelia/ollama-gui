<template>
  <div>
    <h1>{{ allUsers }}</h1>
    <input v-model="range" type="number" />
    <button @click="() => range++">Fetch User</button>
    <h2 v-if="fetchedUser">{{ fetchedUser }}</h2>
    <input v-model="newUser.firstName" type="text" placeholder="First Name" />
    <input v-model="newUser.lastName" type="text" placeholder="Last Name" />
    <button @click="addUser">Add User</button>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: number;
  firstName: string;
  lastName: string;
  // Add more properties if needed
}
interface NewUser {
  firstName: string;
  lastName: string;
  // Add more properties if needed
}

interface UserData {
  users: User[]; // Array of User objects
}

const { data: allUsers, error } = useFetch<UserData>("api/users");

if (error.value) {
  console.error("Error fetching data:", error.value);
}

let range = ref<number>(0);
let fetchedUser = ref<UserData | null>(null);

watch(range, async (value) => {
  const data = $fetch<UserData>("api/users/" + value);
  fetchedUser.value = await data;
});

const newUser = ref<NewUser>({
  firstName: "",
  lastName: "",
});

const addUser = async () => {
  try {
    await useFetch("api/users", {
      method: "POST",
      body: newUser,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("User added successfully", newUser);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};
</script>

<style scoped></style>
