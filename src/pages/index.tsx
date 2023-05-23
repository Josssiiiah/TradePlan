import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  async function onSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: input }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(
        data.result.replace(/(?<!\d)\. /g, ".\n").replace(/: /g, ":\n")
      );
      setInput("");
    } catch (error) {
      const e = error as Error;
      console.error(e);
      alert(e.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className="flex flex-col items-center pt-10">
        <img src="/dog.png" className={styles.icon} />
        <h3 className="m-16 text-3xl text-black">Trade Plan Generator</h3>
        <form onSubmit={onSubmit} className="flex w-[320px] flex-col">
          <input
            className="mb-4 border border-gray-300 p-2"
            type="text"
            name="input"
            placeholder="Enter your input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input
            className="cursor-pointer rounded bg-blue-600 px-12 py-4 text-center text-white"
            type="submit"
            value="Generate"
          />
        </form>
        <div
          className="mx-32 mt-20 border px-16 py-5 font-bold"
          style={{ whiteSpace: "pre-line" }}
        >
          {result}
        </div>
      </main>
    </div>
  );
}
