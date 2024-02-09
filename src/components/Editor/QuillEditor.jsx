import React, { useEffect, useRef, useState } from "react";
import "../../css/quillEditor.css";
import { useFirestore } from "react-redux-firebase";
import { useDispatch, useSelector } from "react-redux";
import { Prompt } from "react-router-dom";
import { setCurrentStepContent } from "../../store/actions";
import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import { FirestoreProvider, getColor } from "@gmcfall/yjs-firestore-provider";
import { onlineFirebaseApp } from "../../config";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
window.Quill = Quill;
(async function () {
  let res = await import("quill-image-resize");
  Quill.register("modules/imageResize", res.default);
})();
Quill.register("modules/cursors", QuillCursors);

const QuillEditor = ({ id, data, tutorial_id }) => {
  const [allSaved, setAllSaved] = useState(true);
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  let noteID = id || "test_note";
  const firestore = useFirestore();
  const dispatch = useDispatch();
  // This path in cloud firestore contains yjs documents storing content of a step
  // (actual data used to render is present in "steps" collection in the same doc)
  const basePath = ["tutorials", tutorial_id, "yjsStepDocs", id];
  let provider, binding, ydoc;

  const currentUserHandle = useSelector(
    ({
      firebase: {
        profile: { handle }
      }
    }) => handle
  );

  useEffect(() => {
    setAllSaved(true);
  }, [id]);

  function deltaToHtml(delta) {
    let html = "";
    delta.ops.forEach(op => {
      if (op.insert) {
        let text = op.insert;
        if (typeof text === "string") {
          const attributes = op.attributes || {};
          let style = "";

          // Extract font and size from attributes
          if (attributes.font) {
            style += `font-family: ${attributes.font};`;
          }
          if (attributes.size) {
            style += `font-size: ${attributes.size}px;`;
          }

          // Add other formatting styles as needed
          if (style) {
            text = `<span style="${style}">${text}</span>`;
          }

          // Add new line if it's present in the original text
          if (text.includes("\n")) {
            text = text.replace(/\n/g, "<br>");
          }

          html += text;
        }
      }
    });
    return html;
  }

  useEffect(() => {
    try {
      if (!ydoc) {
        // yjs document
        ydoc = new Y.Doc();

        // on updating text in editor this gets triggered
        ydoc.on("update", () => {
          // deltaText is quill editor's data structure to store text
          const deltaText = ydoc.getText("quill").toDelta();
          var config = {};
          var converter = new QuillDeltaToHtmlConverter(deltaText, config);

          var html = converter.convert();
          setCurrentStepContent(tutorial_id, id, html)(firestore, dispatch);
        });
        provider = new FirestoreProvider(onlineFirebaseApp, ydoc, basePath, {
          disableAwareness: true
        });
      }
      const ytext = ydoc.getText("quill");
      const container = containerRef.current;

      // Clear all extra divs except the editor
      while (
        container.firstChild &&
        container.firstChild !== editorRef.current
      ) {
        container.removeChild(container.firstChild);
      }

      const editor = new Quill(editorRef.current, {
        modules: {
          cursors: true,
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],

            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            [{ direction: "rtl" }], // text direction

            [{ size: ["small", false, "large", "huge"] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],
            ["clean"], // remove formatting button
            ["link", "image"]
          ],
          history: {
            userOnly: true
          },
          imageResize: { modules: ["Resize", "DisplaySize", "Toolbar"] }
        },
        placeholder: "Start collaborating...",
        theme: "snow"
      });

      const content = editor.getContents();
      const formattedText = deltaToHtml(content);
      setCurrentStepContent(
        tutorial_id,
        id,
        formattedText
      )(firestore, dispatch);
      binding = new QuillBinding(ytext, editor, provider.awareness);
      const length = editor.getLength();
      editor.deleteText(0, length, "user");
      editor.clipboard.dangerouslyPasteHTML(0, data);
    } catch (err) {
      console.log(err);
    }

    return () => {
      try {
        binding.destroy();
      } catch (err) {
        console.log(err);
      }
    };
  }, []);

  return (
    <div style={{ flexGrow: 1 }}>
      <Prompt
        when={!allSaved}
        message="You have unsaved changes, are you sure you want to leave?"
      />
      <div
        ref={containerRef}
        style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}
      >
        <div id="quill-editor" ref={editorRef} style={{ flexGrow: 1 }} />
      </div>
    </div>
  );
};

export default QuillEditor;
