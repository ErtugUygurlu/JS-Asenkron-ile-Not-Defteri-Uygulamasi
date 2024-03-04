const noteList = document.getElementById('noteList');
const addNoteButton = document.getElementById('addNoteButton');

let notes = [];

addNoteButton.addEventListener('click', addNote);

async function displayNotes() {
  try {
    const fetchedNotes = await fetchNotes();
    notes = fetchedNotes;
    renderNotes();
  } catch (error) {
    console.error(error);
    alert('Notlar alınamadı.');
  }
}

function addNote() {
  const noteTitle = prompt('Not başlığını girin:');
  if (noteTitle) {
    const noteContent = prompt('Not içeriğini girin:');
    if (noteContent) {
      const newNote = { id: Date.now(), title: noteTitle, content: noteContent };
      saveNoteLocally(newNote).then(() => {
        notes.push(newNote);
        renderNotes();
      }).catch(error => {
        console.error(error);
        alert('Not eklenirken bir hata oluştu.');
      });
    } else {
      alert('Not içeriği boş olamaz.');
    }
  } else {
    alert('Not başlığı boş olamaz.');
  }
}

function updateNote(noteId) {
  const note = notes.find(n => n.id === noteId);
  if (note) {
    const newTitle = prompt('Yeni başlık:');
    const newContent = prompt('Yeni içerik:');
    if (newTitle && newContent) {
      note.title = newTitle;
      note.content = newContent;
      updateNoteLocally(note).then(() => {
        renderNotes();
        alert('Not başarıyla güncellendi.');
      }).catch(error => {
        console.error(error);
        alert('Not güncellenirken bir hata oluştu.');
      });
    } else {
      alert('Geçerli bir başlık ve içerik girin.');
    }
  }
}

function deleteNote(noteId) {
  const confirmDelete = confirm('Bu notu silmek istediğinizden emin misiniz?');
  if (confirmDelete) {
    deleteNoteLocally(noteId).then(() => {
      notes = notes.filter(n => n.id !== noteId);
      renderNotes();
      alert('Not başarıyla silindi.');
    }).catch(error => {
      console.error(error);
      alert('Not silinirken bir hata oluştu.');
    });
  }
}

async function fetchNotes() {
  return new Promise((resolve) => {
   
    const localNotes = localStorage.getItem('notes');
    const parsedNotes = localNotes ? JSON.parse(localNotes) : [];
    resolve(parsedNotes);
  });
}

async function saveNoteLocally(note) {
  return new Promise((resolve, reject) => {
    
    let localNotes = localStorage.getItem('notes');
    if (!localNotes) {
      localNotes = [];
    } else {
      localNotes = JSON.parse(localNotes);
    }

    localNotes.push(note);
    localStorage.setItem('notes', JSON.stringify(localNotes));
    resolve();
  });
}

async function updateNoteLocally(updatedNote) {
  return new Promise((resolve, reject) => {
    
    let localNotes = localStorage.getItem('notes');
    if (!localNotes) {
      localNotes = [];
    } else {
      localNotes = JSON.parse(localNotes);
    }

    const existingNoteIndex = localNotes.findIndex(n => n.id === updatedNote.id);
    if (existingNoteIndex !== -1) {
      localNotes[existingNoteIndex] = updatedNote;
      localStorage.setItem('notes', JSON.stringify(localNotes));
      resolve();
    } else {
      reject('Not bulunamadı.');
    }
  });
}

async function deleteNoteLocally(noteId) {
  return new Promise((resolve, reject) => {
    
    let localNotes = localStorage.getItem('notes');
    if (!localNotes) {
      localNotes = [];
    } else {
      localNotes = JSON.parse(localNotes);
    }

    const updatedNotes = localNotes.filter(n => n.id !== noteId);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    resolve();
  });
}

function renderNotes() {
  noteList.innerHTML = '';
  notes.forEach(createNoteElement);
}

function createNoteElement(note) {
  const noteElement = document.createElement('div');
  noteElement.classList.add('note');

  const titleElement = document.createElement('h2');
  titleElement.textContent = note.title;

  const contentElement = document.createElement('p');
  contentElement.textContent = note.content;

  const editButton = document.createElement('button');
  editButton.textContent = 'Düzenle';
  editButton.className = 'edit';
  editButton.addEventListener('click', () => updateNote(note.id));

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Sil';
  deleteButton.className = 'delete';
  deleteButton.addEventListener('click', () => deleteNote(note.id));

  noteElement.appendChild(titleElement);
  noteElement.appendChild(contentElement);
  noteElement.appendChild(editButton);
  noteElement.appendChild(deleteButton);

  noteList.appendChild(noteElement);
}


notes = [
  { id: 1, title: 'Başlık 1', content: 'İçerik 1' },
  { id: 2, title: 'Başlık 2', content: 'İçerik 2' },
  { id: 3, title: 'Başlık 3', content: 'İçerik 3' },
];


displayNotes();

