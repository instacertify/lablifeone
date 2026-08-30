"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import CharacterCount from "@tiptap/extension-character-count";
import { useEffect } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export function FolioEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        placeholder: placeholder || "Compose the folio — headings, lists, images from the Vault.",
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      TextStyle,
      Color,
      CharacterCount,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[22rem] folio-content focus:outline-none",
      },
    },
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  async function uploadImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const body = new FormData();
      body.append("file", file);
      body.append("alt", file.name);
      const response = await fetch("/api/media", { method: "POST", body });
      const payload = await response.json();
      if (payload.url) {
        editor?.chain().focus().setImage({ src: payload.url, alt: payload.alt || "" }).run();
      }
    };
    input.click();
  }

  if (!editor) {
    return <div className="min-h-[22rem] rounded-2xl bg-ivory" />;
  }

  const words = editor.storage.characterCount?.words?.() ?? 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#102226]">
      <div className="flex flex-wrap gap-1 border-b border-white/10 px-3 py-2">
        {(
          [
            { label: "Para", run: () => editor.chain().focus().setParagraph().run() },
            { label: "H2", run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
            { label: "H3", run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
            { label: "Bold", run: () => editor.chain().focus().toggleBold().run() },
            { label: "Italic", run: () => editor.chain().focus().toggleItalic().run() },
            { label: "Underline", run: () => editor.chain().focus().toggleUnderline().run() },
            { label: "Quote", run: () => editor.chain().focus().toggleBlockquote().run() },
            { label: "List", run: () => editor.chain().focus().toggleBulletList().run() },
            { label: "Numbered", run: () => editor.chain().focus().toggleOrderedList().run() },
            { label: "Mark", run: () => editor.chain().focus().toggleHighlight().run() },
          ] as const
        ).map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.run}
            className="rounded-md px-2 py-1 text-[11px] tracking-[0.12em] text-sand/80 uppercase hover:bg-white/10 hover:text-aqua"
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={uploadImage}
          className="rounded-md bg-aqua/15 px-2 py-1 text-[11px] tracking-[0.12em] text-aqua uppercase"
        >
          Image
        </button>
        <button
          type="button"
          onClick={() => {
            const href = window.prompt("Link URL");
            if (href) editor.chain().focus().setLink({ href }).run();
          }}
          className="rounded-md px-2 py-1 text-[11px] tracking-[0.12em] text-sand/80 uppercase hover:bg-white/10"
        >
          Link
        </button>
        <span className="ml-auto self-center font-mono text-[11px] text-sand/50">
          {words} words
        </span>
      </div>
      <EditorContent editor={editor} className="bg-[#0d1c1f] text-ivory" />
    </div>
  );
}
