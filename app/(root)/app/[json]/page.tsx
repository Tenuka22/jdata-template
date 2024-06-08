"use client";

import JsonEditor from "@/components/json-editor";
import React from "react";

const App = ({ params }: { params: { json: string } }) => {
  let jsonData;

  try {
    const decodedJson = decodeURIComponent(params.json);
    jsonData = JSON.parse(decodedJson);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    jsonData = null;
  }

  return (
    <div className="flex items-start justify-start w-full h-full">
      {jsonData ? (
        <JsonEditor
          className="w-full h-[80vh]"
          setJson={() => {}}
          jsonText={JSON.stringify(jsonData, null, 2)}
        />
      ) : (
        <p>Invalid JSON</p>
      )}
    </div>
  );
};

export default App;
