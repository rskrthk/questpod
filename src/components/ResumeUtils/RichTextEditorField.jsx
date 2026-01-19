// src/components/RichTextEditorField.js

"use client";

import React, { useEffect, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
const lowlight = createLowlight(common);

import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Quote,
  Minus,
  Undo,
  Redo,
  Eraser,
  Lightbulb,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Underline as UnderlineIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Code2,
  List,
  ListOrdered, // Import for ordered lists
} from "lucide-react";

const RichTextEditorField = ({
  label,
  value,
  onUpdate,
  onAISuggestion,
  loadingSuggestion,
  identifier,
  placeholder = "Start typing...",
}) => {
  const editorRef = useRef(null);

  const handleUpdate = useCallback(
    ({ editor }) => {
      if (onUpdate && editor.getHTML() !== value) {
        onUpdate(editor.getHTML());
      }
    },
    [onUpdate, value]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
        blockquote: false,
        heading: false,
        codeBlock: false,
      }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: true, autolink: true }),
      Image.configure({ inline: true, allowBase64: true }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Subscript,
      Superscript,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: value || "",
    onUpdate: handleUpdate,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none focus:outline-none p-4 min-h-[150px] text-gray-900 dark:text-gray-100 dark:bg-gray-800 transition-colors duration-200 overflow-y-auto",
        style: { maxHeight: "400px" },
        id: `richtext-editor-${identifier}`,
      },
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  const handleAISuggestionClick = useCallback(() => {
    if (onAISuggestion && editor) {
      onAISuggestion(identifier, editor.getHTML() || "");
    }
  }, [onAISuggestion, identifier, editor]);

  if (!editor) return null;

  const getButtonClass = (isActive) =>
    `p-2 rounded-md transition-all text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  const ToolbarButton = ({ onClick, icon: Icon, isActive, disabled, label }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={getButtonClass(isActive)}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div
      className="relative border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-900 transition-all duration-300 overflow-hidden flex flex-col"
      ref={editorRef}
    >
      {label && (
        <label
          htmlFor={`richtext-editor-${identifier}`}
          className="block text-sm font-medium text-gray-800 dark:text-gray-200 px-4 pt-4 pb-2"
        >
          {label}
        </label>
      )}

      <div className="flex flex-wrap items-center gap-1 p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto min-h-[56px] editor-toolbar">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} icon={Bold} isActive={editor.isActive("bold")} label="Bold" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} icon={Italic} isActive={editor.isActive("italic")} label="Italic" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} icon={UnderlineIcon} isActive={editor.isActive("underline")} label="Underline" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} icon={Strikethrough} isActive={editor.isActive("strike")} label="Strikethrough" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} icon={Code} isActive={editor.isActive("code")} label="Inline Code" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} icon={Highlighter} isActive={editor.isActive("highlight")} label="Highlight" />

        <div className="border-l border-gray-300 dark:border-gray-600 h-5 mx-2" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} icon={List} isActive={editor.isActive("bulletList")} label="Bullet List" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} icon={ListOrdered} isActive={editor.isActive("orderedList")} label="Ordered List" />
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} icon={Minus} isActive={false} label="Horizontal Rule" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} icon={Code2} isActive={editor.isActive("codeBlock")} label="Code Block" />

        <div className="border-l border-gray-300 dark:border-gray-600 h-5 mx-2" />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} icon={AlignLeft} isActive={editor.isActive({ textAlign: "left" })} label="Align Left" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} icon={AlignCenter} isActive={editor.isActive({ textAlign: "center" })} label="Align Center" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} icon={AlignRight} isActive={editor.isActive({ textAlign: "right" })} label="Align Right" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} icon={AlignJustify} isActive={editor.isActive({ textAlign: "justify" })} label="Align Justify" />

        <div className="border-l border-gray-300 dark:border-gray-600 h-5 mx-2" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} icon={SubscriptIcon} isActive={editor.isActive("subscript")} label="Subscript" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} icon={SuperscriptIcon} isActive={editor.isActive("superscript")} label="Superscript" />

        <div className="border-l border-gray-300 dark:border-gray-600 h-5 mx-2" />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} icon={Undo} isActive={false} disabled={!editor.can().undo()} label="Undo" />
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} icon={Redo} isActive={false} disabled={!editor.can().redo()} label="Redo" />
        <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} icon={Eraser} isActive={false} label="Clear Formatting" />

        {onAISuggestion && (
          <div className="ml-auto">
            <button
              type="button"
              onClick={handleAISuggestionClick}
              disabled={loadingSuggestion}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingSuggestion ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <Lightbulb size={16} /> AI Suggestion
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <EditorContent editor={editor} className="flex-grow" />
    </div>
  );
};

export default RichTextEditorField;
