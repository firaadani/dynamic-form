"use client";
import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";

const EditorComponent = ({ name, onBlur, initVal, caller }) => {
  const [data, setData] = useState(null);
  return (
    <CKEditor
      config={{
        toolbar: [
          "undo",
          "redo",
          "|",
          "bold",
          "italic",
          "|",
          "link",
          "bulletedList",
          "imageUpload",
          "|",
        ],
      }}
      editor={Editor}
      onReady={(editor) => {
        // You can store the "editor" and use when it is needed.
        // console.log("Editor is ready to use!", editor);
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        console.log({ event, editor, data });
        setData(data);
      }}
      onBlur={(event, editor) => {
        console.log("Blur.", editor, data);
        if (caller?.includes("answer")) {
          onBlur({ answer: data, id: caller.split("-")?.[1] });
        } else {
          onBlur({ name: name, wsiwygdata: data });
        }
      }}
      onFocus={(event, editor) => {
        console.log("Focus.", editor);
      }}
      data={initVal}
    />
  );
};

export default EditorComponent;
