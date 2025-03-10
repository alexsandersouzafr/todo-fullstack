"use client";

import { format } from "date-fns";
import { Check, Edit, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [currentEditModeId, setCurrentEditModeId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setTasks(data.data));
  }, []);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [currentEditModeId]);

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
      if (inputRef.current) {
        inputRef.current.value = "";
      }
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

  async function handleEdit(id: string) {
    setCurrentEditModeId("");
    try {
      if (!editInputRef.current) return;
      const res = await fetch("/api/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editInputRef.current.value, id: id }),
      });

      if (!res.ok) throw new Error("Failed to update task.");

      const newData = await res.json();
      setTasks(newData.data);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });

      if (!res.ok) throw new Error("Failed to delete task.");

      const newData = await res.json();
      setTasks(newData.data);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          ref={inputRef}
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
            <div
              key={i}
              className="flex items-center border w-2xl rounded-md justify-between px-4 py-2 gap-8 border-slate-300"
            >
              <div className="p-2 flex gap-4 items-center w-full justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    className="size-6 accent-green-700"
                    checked={task.done}
                    onChange={() => handleCheckbox(task.id)}
                  />

                  <span
                    data-checked={task.done}
                    className="data-[checked=true]:line-through"
                  >
                    {currentEditModeId === task.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleEdit(task.id);
                        }}
                      >
                        <input
                          ref={editInputRef}
                          name="name"
                          defaultValue={task.name}
                        />
                      </form>
                    ) : (
                      task.name
                    )}
                  </span>
                </div>
                <div className="flex gap-4">
                  {task.doneAt && (
                    <div className="text-xs text-slate-600">
                      Done at:
                      <br />
                      {format(task.doneAt, "dd/MM/yyyy HH:mm")}
                    </div>
                  )}
                  <div className="text-xs text-slate-600">
                    Created at:
                    <br />
                    {format(task.createdAt, "dd/MM/yyyy HH:mm")}
                  </div>
                  {currentEditModeId === task.id ? (
                    <button
                      className="bg-green-700 text-white border rounded-md p-2"
                      onClick={() => handleEdit(task.id)}
                    >
                      <Check className="size-5" />
                    </button>
                  ) : (
                    <button
                      className="text-green-700 border rounded-md p-2"
                      onClick={() => {
                        setCurrentEditModeId(task.id);
                      }}
                    >
                      <Edit className="size-5" />
                    </button>
                  )}
                  <button
                    className="text-red-700 border rounded-md p-2"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>Create a new task.</>
        )}
      </div>
    </div>
  );
}
