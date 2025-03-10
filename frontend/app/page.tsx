import ToDo from "@/components/todo";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 items-center justify-center h-screen">
      <h1>TODO</h1>
      <ToDo />
    </div>
  );
}
