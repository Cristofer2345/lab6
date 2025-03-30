<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Administrador de tareas </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-list>
        <ion-item
          v-for="(task, index) in tareas"
          :key="index"
          lines="full"
        >
          <ion-label>{{ task.tarea }}</ion-label>
          <ion-button color="primary" @click="editTask(index)">
            <ion-icon slot="icon-only" name="create-outline"></ion-icon>
          </ion-button>
          <ion-button color="danger" @click="deleteTask(index)">
            <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>

      <ion-item>
        <ion-input
          v-model="newTask"
          placeholder="Enter a new task"
          clear-input
        ></ion-input>
        <ion-button color="success" @click="addTask">
          {{ editingIndex !== null ? "Update" : "Add" }}
        </ion-button>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonInput,
} from '@ionic/vue';
import { getTasks, addTaskToDB } from "@/db/conexion";
import 'ionicons';
import { createOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
addIcons({
  createOutline,
  trashOutline,
});
import { ref } from 'vue';
import { updateTaskInDB, deleteTaskFromDB } from "@/db/conexion";

const tareas = ref<any[]>([]);
const newTask = ref<string>('');
const editingIndex = ref<number | null>(null);

async function getTarea() {
  tareas.value = await getTasks();
}

async function addTask() {
  if (newTask.value.trim() === '') return;
  if (editingIndex.value !== null) {
    tareas.value[editingIndex.value].tarea = newTask.value;
    await updateTaskInDB(tareas.value[editingIndex.value]);
    editingIndex.value = null;
  } else {
    const newTaskObj = { tarea: newTask.value, done: false };
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
h3 {
  margin: 0;
  font-size: 18px;
}

ion-card {
  margin-bottom: 16px;
}

ion-button {
  --border-radius: 8px;
}
</style>
