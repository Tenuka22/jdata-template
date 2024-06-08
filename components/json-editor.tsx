import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Editor, Monaco } from "@monaco-editor/react";
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

const JsonEditor = ({
  setJson,
  jsonText,
  className,
}: {
  setJson: (...event: any[]) => void;
  jsonText: string;
  className?: ClassNameValue;
}) => {
  const editorRef = useRef();

  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <div className="w-full h-full flex-1 flex-grow pb-4">
      <div className="dark:hidden flex h-full w-full">
        <Editor
          options={{
            minimap: {
              enabled: false,
            },
          }}
          className={cn("md:min-w-80 flex-1 w-full h-full min-h-80", className)}
          height="10rem"
          theme="light"
          language={"json"}
          defaultValue={jsonText}
          onMount={onMount}
          value={jsonText}
          onChange={(newValue) => setJson(newValue || "")}
        />
      </div>
      <div className="hidden dark:flex h-full w-full">
        {" "}
        <Editor
          options={{
            minimap: {
              enabled: false,
            },
          }}
          className={cn("md:min-w-80 flex-1 w-full h-full min-h-80", className)}
          theme="vs-dark"
          language={"json"}
          defaultValue={jsonText}
          onMount={onMount}
          value={jsonText}
          onChange={(newValue) => setJson(newValue || "")}
        />
      </div>
    </div>
  );
};

export default JsonEditor;
