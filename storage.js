/**
 * وظائف التخزين المحلي
 * هذا الملف يحتوي على الوظائف المسؤولة عن التعامل مع localStorage
 */

// الحصول على الملاحظات من localStorage
export function getNotes() {
  const notes = localStorage.getItem('notes');
  return notes ? JSON.parse(notes) : [];
}

// حفظ ملاحظة جديدة
export function saveNote(note) {
  const notes = getNotes();
  notes.push(note);
  localStorage.setItem('notes', JSON.stringify(notes));
}

// تحديث ملاحظة موجودة
export function updateNote(id, updatedNote) {
  const notes = getNotes();
  const index = notes.findIndex(note => note.id === parseInt(id));
  
  if (index !== -1) {
    notes[index] = { ...notes[index], ...updatedNote };
    localStorage.setItem('notes', JSON.stringify(notes));
    return true;
  }
  
  return false;
}

// حذف ملاحظة
export function deleteNote(id) {
  const notes = getNotes();
  const filteredNotes = notes.filter(note => note.id !== parseInt(id));
  
  if (filteredNotes.length !== notes.length) {
    localStorage.setItem('notes', JSON.stringify(filteredNotes));
    return true;
  }
  
  return false;
}
