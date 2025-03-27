<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Task Manager</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <h2>Task List</h2>
      <ul>
        <li v-for="(task, index) in tareas" :key="index">
          {{ task.tarea }}
          <button @click="editTask(index)">Edit</button>
          <button @click="deleteTask(index)">Delete</button>
        </li>
      </ul>
      <div>
        <input v-model="newTask" placeholder="Add a new task" />
        <button @click="addTask">Add Task</button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { getTasks, addTaskToDB, updateTaskInDB, deleteTaskFromDB } from "@/db/conexion";
import { ref } from 'vue';

const tareas = ref<any[]>([]);
const newTask = ref<string>('');
const editingIndex = ref<number | null>(null);

async function getTarea() {
  tareas.value = await getTasks();
}

async function addTask() {
  if (newTask.value.trim() === '') return;
  if (editingIndex.value !== null) {
    // Update existing task
    tareas.value[editingIndex.value].tarea = newTask.value;
    await updateTaskInDB(tareas.value[editingIndex.value]);
    editingIndex.value = null;
  } else {
    // Add new task
    const newTaskObj = { tarea: newTask.value };
    await addTaskToDB(newTaskObj);
    tareas.value.push(newTaskObj);
  }
  newTask.value = '';
}

function editTask(index: number) {
  newTask.value = tareas.value[index].tarea;
  editingIndex.value = index;
}

async function deleteTask(index: number) {
  await deleteTaskFromDB(tareas.value[index]);
  tareas.value.splice(index, 1);
}

getTarea();
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
