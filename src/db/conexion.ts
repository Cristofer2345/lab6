import { createClient } from "@libsql/client/web";

export const turso = createClient({
  url: import.meta.env.VITE_TURSO_AUTH_DATABASE_URL,
  authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN,
});

export async function getTasks() {
  const tasks = await turso.execute("SELECT * FROM task");
  return tasks.rows;
}

export async function addTaskToDB(task: { tarea: string }) {
  await turso.execute("INSERT INTO task (tarea) VALUES ($1)", [task.tarea]);
}

export async function updateTaskInDB(task: { id: number; tarea: string }) {
  await turso.execute("UPDATE task SET tarea = $1 WHERE id = $2", [task.tarea, task.id]);
}

export async function deleteTaskFromDB(taskId: number) {
  await turso.execute("DELETE FROM task WHERE id = $1", [taskId]);
}

export async function getTaskById(taskId: number) {
  const task = await turso.execute("SELECT * FROM task WHERE id = $1", [taskId]);
  return task.rows[0];
}