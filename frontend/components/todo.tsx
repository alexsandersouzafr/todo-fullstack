"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";

export type Task = {
  id: string;
  name: string;
  done: boolean;
  createdAt: Date;
  doneAt: Date | null;
  deleted: boolean;
};

export default function ToDo() {
  const [tasks, setTasks] = useState<Task[]>();

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setTasks(data.data));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const taskName = formData.get("name") as string;
    if (!taskName) return;

    try {
      const res = await fetch("/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: taskName }),
      });

      if (!res.ok) throw new Error("Failed to add task.");

      const newData = await res.json();
      setTasks(newData.data);
      event.currentTarget.reset();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  async function handleCheckbox(id: string) {
    try {
      const res = await fetch("/api/done", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });

      if (!res.ok) throw new Error("Failed to update task.");

      const newData = await res.json();
      setTasks(newData.data);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          name="name"
          placeholder="New Task"
          className="w-full px-4 py-2 border border-green-950 rounded-md"
        />
        <button
          type="submit"
          className="rounded-md bg-green-700 text-white p-4"
        >
          Add
        </button>
      </form>
      <div className="flex flex-col gap-2">
        {tasks && tasks.length > 0 ? (
          tasks.map((task, i) => (
            <div className="p-2 flex gap-4 items-baseline" key={i}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleCheckbox(task.id)}
              />
              <span
                data-checked={task.done}
                className="data-[checked=true]:line-through"
              >
                {task.name}
              </span>
              <div className="text-xs text-slate-600">
                Created at: {format(task.createdAt, "dd/MM/yyyy HH:mm")}
              </div>
              {task.doneAt && (
                <div className="text-xs text-slate-600">
                  Done at: {format(task.doneAt, "dd/MM/yyyy HH:mm")}
                </div>
              )}
            </div>
          ))
        ) : (
          <>Create a new task.</>
        )}
      </div>
    </div>
  );
}
