import React, { useEffect, useMemo, useState } from "react";
import "../../css/tiptapEditor.css";
import { useFirestore } from "react-redux-firebase";
import { useDispatch } from "react-redux";
import { Prompt } from "react-router-dom";
import { setCurrentStepContent } from "../../store/actions";
import * as Y from "yjs";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { FirestoreProvider } from "@gmcfall/yjs-firestore-provider";
import { onlineFirebaseApp } from "../../config";
import EditorToolbar from "./EditorToolbar";

const TiptapEditor = ({ id, data, tutorial_id }) => {
  const [allSaved, setAllSaved] = useState(true);
  const firestore = useFirestore();
  const dispatch = useDispatch();
  // This path in cloud firestore contains yjs documents storing content of a step
  // (actual data used to render is present in "steps" collection in the same doc)
  const basePath = ["tutorials", tutorial_id, "yjsStepDocs", id];

  const { ydoc, provider } = useMemo(() => {
    const doc = new Y.Doc();
    const yProvider = new FirestoreProvider(onlineFirebaseApp, doc, basePath, {
      disableAwareness: true
    });
    return { ydoc: doc, provider: yProvider };
  }, [id, tutorial_id]);

  useEffect(() => {
    setAllSaved(true);
    return () => {
      try {
        provider.destroy();
      } catch (err) {
        console.log(err);
      }
    };
  }, [provider]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          undoRedo: false,
          link: {
            openOnClick: false
          }
        }),
        Collaboration.configure({ document: ydoc }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        TextStyleKit.configure({ lineHeight: false }),
        Subscript,
        Superscript,
        Image.configure({ allowBase64: true }),
        Placeholder.configure({ placeholder: "Start collaborating..." })
      ],
      editorProps: {
        attributes: {
          id: "tiptap-editor",
          class: "tiptap-editor"
        }
      },
      onUpdate: ({ editor: currentEditor }) => {
        setCurrentStepContent(
          tutorial_id,
          id,
          currentEditor.getHTML()
        )(firestore, dispatch);
      }
    },
    [ydoc]
  );

  return (
    <div style={{ flexGrow: 1 }}>
      <Prompt
        when={!allSaved}
        message="You have unsaved changes, are you sure you want to leave?"
      />
      <div
        style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}
      >
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} style={{ flexGrow: 1 }} />
      </div>
    </div>
  );
};

export default TiptapEditor;
