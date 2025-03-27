
import { createClient } from "@libsql/client/web";

  export const turso = createClient({
  url: import.meta.env.VITE_TURSO_AUTH_DATABASE_URL,
  authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN,
});
 
  export async function getTasks() {
  const tasks = await turso.execute("SELECT * FROM task");
  return tasks.rows;
 }
 export async function addTaskToDB(task: { name: string }) {
  await turso.execute("INSERT INTO task (name) VALUES ($1)", [task.name]);
 }