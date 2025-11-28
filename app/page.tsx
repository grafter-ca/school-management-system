import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-20">
      <div className="flex items-center gap-2">
        <p className="fixed gap-2 left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-linear-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <span className="font-mono font-bold">Welcome to</span>{' '}
          <code className="font-mono font-bold">School Management System!</code>
        </p>

      </div>
        <h1 className="text-red-400 border-2 rounded-2xl px-5 py-2 hover:text-white hover:bg-red-500 cursor-pointer">Login</h1>
    </main>
  );
}
