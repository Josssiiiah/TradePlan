import React, { useState } from "react";

const MyComponent = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleClick = async () => {
    // Send a request to your server here
    // Get the data and set the response
    const result = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instruction: input }),
    });

    const data = await result.json();
    setResponse(data.answer);
  };

  return (
    <div className="p-4">
      <input
        className="w-full border-2 border-gray-300 p-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="mt-4 bg-blue-500 px-4 py-2 text-white"
        onClick={handleClick}
      >
        Send Instruction
      </button>
      <div className="mt-4">{response}</div>
    </div>
  );
};

export default MyComponent;
