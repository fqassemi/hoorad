'use client';

import React, { useEffect, useRef, useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  convertFromHTML,
  ContentState,
  CompositeDecorator,
} from "draft-js";
import draftToHtml from 'draftjs-to-html';
import Toolbar from "@/app/admin/news/ToolBar/ToolBar";
import "./DraftEditor.css";

const DraftEditor = ({ onContentChange, initialHtml }) => {
  const findLinkEntities = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "LINK"
      );
    }, callback);
  };

  const Link = ({ contentState, entityKey, children }) => {
    const { url } = contentState.getEntity(entityKey).getData();
    return (
      <a href={url} style={{ color: "blue", textDecoration: "underline" }}>
        {children}
      </a>
    );
  };

  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ]);

  const [editorState, setEditorState] = useState(() => {
    if (initialHtml) {
      const blocksFromHTML = convertFromHTML(initialHtml);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      return EditorState.createWithContent(contentState, decorator);
    } else {
      return EditorState.createEmpty(decorator);
    }
  });

  const editor = useRef(null);

  useEffect(() => {
    focusEditor();
  }, []);

  const focusEditor = () => {
    editor.current.focus();
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  };

  const styleMap = {
    CODE: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
    HIGHLIGHT: {
      backgroundColor: "#FFFFA7",
    },
    UPPERCASE: {
      textTransform: "uppercase",
    },
    LOWERCASE: {
      textTransform: "lowercase",
    },
    CODEBLOCK: {
      fontFamily: '"fira-code", "monospace"',
      fontSize: "inherit",
      background: "#ffeff0",
      fontStyle: "italic",
      lineHeight: 1.5,
      padding: "0.3rem 0.5rem",
      borderRadius: " 0.2rem",
    },
    SUPERSCRIPT: {
      verticalAlign: "super",
      fontSize: "80%",
    },
    SUBSCRIPT: {
      verticalAlign: "sub",
      fontSize: "80%",
    },
  };

  const myBlockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    switch (type) {
      case "header-one":
        return "text-4xl font-bold my-4";
      case "header-two":
        return "text-3xl font-bold my-4";
      case "header-three":
        return "text-2xl font-bold my-4";
      case "header-four":
        return "text-xl font-bold my-4";
      case "header-five":
        return "text-lg font-bold my-4";
      case "header-six":
        return "text-base font-bold my-4";
      case "blockQuote":
        return "italic ml-5 border-l-4 border-[#ccc] pl-2.5";
      case "leftAlign":
        return "text-left";
      case "rightAlign":
        return "text-right";
      case "centerAlign":
        return "text-center";
      case "justifyAlign":
        return "text-justify";
      case "unordered-list-item":
        return "list-disc mx-2";
      case "ordered-list-item":
        return "list-decimal mx-2";
      default:
        return null;
    }
  };

  const addLink = () => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const url = prompt("Enter a URL:");
      if (url) {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity("LINK", "MUTABLE", {
          url: url,
        });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, {
          currentContent: contentStateWithEntity,
        });
        setEditorState(RichUtils.toggleLink(newEditorState, selection, entityKey));
      }
    }
  };

  return (
    <div className="editor-wrapper dark:bg-gray-700 border-gray-300 dark:border-gray-600" onClick={focusEditor} dir="rtl" >
      <Toolbar
        editorState={editorState}
        setEditorState={setEditorState}
        addLink={addLink}
      />
      <div className="editor-container">
        <Editor
          ref={editor}
          placeholder="محتوای خبر را اینجا بنویسید..."
          handleKeyCommand={handleKeyCommand}
          customStyleMap={styleMap}
          blockStyleFn={myBlockStyleFn}
          editorState={editorState}
          onChange={(editorState) => {
            const contentState = editorState.getCurrentContent();
            const htmlContent = draftToHtml(convertToRaw(contentState));
            const plainText = contentState.getPlainText();
            onContentChange(htmlContent, plainText);
            setEditorState(editorState);
          }}
          dir="rtl"
        />
      </div>
    </div>
  );
};

export default DraftEditor;