import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    setIsLoading(true); // start loading

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

      setResult(data.result.replace(/(?<!\d)\. /g, ".\n"));
      setInput("");
    } catch (error) {
      const e = error as Error;
      console.error(e);
      alert(e.message);
    } finally {
      setIsLoading(false); // end loading
    }
  }

  return (
    <div>
      <Head>
        <title>TradePlanGenerator</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className="flex flex-col items-center pt-10">
        {/* <img src="/dog.png" className={styles.icon} /> */}
        <h3 className="mb-8 mt-6 text-5xl text-black">Trade Plan Generator</h3>
        <form onSubmit={onSubmit} className="flex w-[500px] flex-col">
          <textarea
            className="mb-8 resize-none border-2 border-blue-600 p-16 pl-2 pt-2 text-left"
            name="input"
            placeholder="Enter your input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="justify-center rounded bg-blue-600 p-6 text-center text-3xl text-white"
          >
            {isLoading ? "Loading..." : "Generate"}
          </button>
        </form>
        <div
          className="mx-32 mb-24 mt-10 border-4 border-blue-600 px-16 py-5 font-bold"
          style={{ whiteSpace: "pre-line" }}
        >
          {result.split("\n\n").map((paragraph, index) => {
            const sentences = paragraph.split("\n");
            return (
              <p key={index}>
                {sentences.map((sentence, sIndex) => {
                  const parts = sentence.split(":");
                  if (parts.length > 1) {
                    return (
                      <span key={`${index}-${sIndex}`}>
                        <span style={{ color: "blue" }}>{parts[0]}</span>:
                        {parts.slice(1).join(":")}
                        <br />
                      </span>
                    );
                  } else {
                    return (
                      <span key={`${index}-${sIndex}`}>
                        {sentence}
                        <br />
                      </span>
                    );
                  }
                })}
                <br />
              </p>
            );
          })}
        </div>
      </main>
    </div>
  );
}
