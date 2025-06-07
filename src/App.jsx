import { useEffect, useState } from "react";
import {
  Sun, Moon, FileDown, Save, FilePlus2, X
} from "lucide-react";

export default function NotepadApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [{ id: 1, content: "" }];
  });
  const [activeNote, setActiveNote] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(mq.matches);
    mq.addEventListener("change", e => setDarkMode(e.matches));
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    const text = notes[activeNote]?.content || "";
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
  }, [notes, activeNote]);

  const updateContent = html => {
    const copy = [...notes];
    copy[activeNote].content = html;
    setNotes(copy);
  };

  const addNote = () => {
    setNotes([...notes, { id: Date.now(), content: "" }]);
    setActiveNote(notes.length);
  };

  const deleteNote = i => {
    const filtered = notes.filter((_, idx) => idx !== i);
    setNotes(filtered);
    setActiveNote(0);
  };

  const exportNote = () => {
    const blob = new Blob([notes[activeNote].content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `note-${notes[activeNote].id}.txt`;
    a.click();
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      darkMode ? "bg-[#1a1a1a] text-[#f9f9f9]" : "bg-[#f9f9f9] text-[#1a1a1a]"
    }`}>
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold" style={{ color: "#d4af37" }}>
            Notepad
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-600"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-4">
          {notes.map((note, idx) => (
            <div
              key={note.id}
              className={`px-4 py-2 rounded-t-2xl cursor-pointer relative ${
                idx === activeNote
                  ? "bg-[#AED9E0] text-black"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              onClick={() => setActiveNote(idx)}
            >
              Note {idx + 1}
              {notes.length > 1 && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    deleteNote(idx);
                  }}
                  className="absolute -top-1 -right-1 text-xs"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addNote}
            className="px-2 py-1 bg-[#d4af37] text-black rounded-t-2xl text-sm"
          >
            <FilePlus2 size={16} />
          </button>
        </div>

        {/* Editor */}
        <div
          contentEditable
          suppressContentEditableWarning
          onInput={e => updateContent(e.currentTarget.innerText)}
          className="w-full min-h-[300px] p-4 rounded-2xl shadow-md text-base focus:outline-none"
          style={{
            backgroundColor: darkMode ? "#2a2a2a" : "#ffffff",
            border: "2px solid #d4af37"
          }}
        >
          {notes[activeNote].content}
        </div>

        {/* Word Count */}
        <div className="mt-4 text-sm text-right italic">
          Word Count: {wordCount}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4 flex-wrap">
          <button
            onClick={() => alert("Note saved!")}
            className="px-4 py-2 rounded-2xl font-medium shadow-md flex items-center gap-2"
            style={{ backgroundColor: "#AED9E0", color: "#1a1a1a" }}
          >
            <Save size={18} /> Save Note
          </button>

          <button
            onClick={exportNote}
            className="px-4 py-2 rounded-2xl font-medium shadow-md border flex items-center gap-2"
            style={{ borderColor: "#AED9E0", color: "#AED9E0" }}
          >
            <FileDown size={18} /> Export
          </button>
        </div>
      </div>
    </div>
  );
}