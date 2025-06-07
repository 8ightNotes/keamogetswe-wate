document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const moonIcon = document.getElementById('moonIcon');
  const sunIcon = document.getElementById('sunIcon');
  const editor = document.getElementById('editor');
  const tabsContainer = document.getElementById('tabsContainer');
  const wordCountEl = document.getElementById('wordCount');
  const saveNoteBtn = document.getElementById('saveNote');
  const exportNoteBtn = document.getElementById('exportNote');

  let notes = JSON.parse(localStorage.getItem("notes")) || [{ id: 1, content: "" }];
  let activeNote = 0;
  let darkMode = false;

  const renderTabs = () => {
    tabsContainer.innerHTML = '';
    notes.forEach((note, index) => {
      const tab = document.createElement('div');
      tab.className = `tab ${index === activeNote ? 'active' : ''}`;
      tab.textContent = `Note ${index + 1}`;
      tab.addEventListener('click', () => {
        activeNote = index;
        render();
      });

      if (notes.length > 1) {
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'X';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteNote(index);
        });
        tab.appendChild(deleteBtn);
      }
      tabsContainer.appendChild(tab);
    });

    const addNoteBtn = document.createElement('button');
    addNoteBtn.textContent = '+';
    addNoteBtn.style.backgroundColor = '#d4af37';
    addNoteBtn.style.color = 'black';
    addNoteBtn.style.borderRadius = '1rem 1rem 0 0';
    addNoteBtn.style.padding = '0.25rem 0.5rem';
    addNoteBtn.addEventListener('click', addNote);
    tabsContainer.appendChild(addNoteBtn);
  };

  const updateWordCount = () => {
    const text = notes[activeNote]?.content || "";
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    wordCountEl.textContent = words;
  };

  const render = () => {
    editor.textContent = notes[activeNote]?.content || '';
    renderTabs();
    updateWordCount();
    updateDarkMode();
  };

  const updateDarkMode = () => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      sunIcon.style.display = 'inline';
      moonIcon.style.display = 'none';
      editor.style.backgroundColor = "#2a2a2a";
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'inline';
      editor.style.backgroundColor = "#ffffff";
    }
  };

  const addNote = () => {
    notes.push({ id: Date.now(), content: "" });
    activeNote = notes.length - 1;
    render();
  };

  const deleteNote = (index) => {
    notes = notes.filter((_, i) => i !== index);
    if (activeNote >= index) {
      activeNote = Math.max(0, activeNote - 1);
    }
    render();
  };

  const exportNote = () => {
    const blob = new Blob([notes[activeNote].content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `note-${notes[activeNote].id}.txt`;
    a.click();
  };

  editor.addEventListener('input', (e) => {
    if (notes[activeNote]) {
        notes[activeNote].content = e.currentTarget.textContent;
    }
    updateWordCount();
  });

  darkModeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    updateDarkMode();
  });

  saveNoteBtn.addEventListener('click', () => {
    localStorage.setItem("notes", JSON.stringify(notes));
    alert("Note saved!");
  });

  exportNoteBtn.addEventListener('click', exportNote);

  // Initial setup
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  darkMode = prefersDark;
  render();
});
