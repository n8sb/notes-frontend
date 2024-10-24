import { useEffect, useState } from 'react';
import Note from './components/Note';
import noteUtils from './services/notes';
import './index.css';
import { Notification } from './components/Notification';
import { Footer } from './components/Footer';

const App = () => {
  const [notes, setNotes] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      await noteUtils
        .getAllNotes()
        .then((initialNotes) => {
          console.log('promise fulfilled');
          setNotes(initialNotes);
        })
        .catch((error) => {
          alert('Failed to fetch notes', error);
        });
    }
    fetchData();
  }, []);

  if (!notes) {
    return null;
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: false,
    };

    noteUtils.createNote(noteObject).then((newNote) => {
      setNotes([...notes, newNote]);
    });

    setNewNote('');
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    noteUtils
      .updateNote(id, changedNote)
      .then((updatedNote) => {
        setNotes(notes.map((note) => (note.id === id ? updatedNote : note)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            toggleImportance={() => toggleImportanceOf(note.id)}
            note={note}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input
          placeholder='a new note...'
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type='submit'>Add note</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
