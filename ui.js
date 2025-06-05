/**
 * وظائف واجهة المستخدم
 * هذا الملف يحتوي على الوظائف المسؤولة عن التعامل مع واجهة المستخدم
 */

import { updateNote, deleteNote, getNotes } from './storage.js';

// عرض الملاحظات
export function renderNotes(notes) {
  const notesGrid = document.getElementById('notes-grid');
  notesGrid.innerHTML = '';
  
  if (notes.length === 0) {
    notesGrid.innerHTML = '<div class="empty-notes">لا توجد ملاحظات. أضف ملاحظة جديدة!</div>';
    return;
  }
  
  notes.forEach(note => {
    const noteCard = createNoteCard(note);
    notesGrid.appendChild(noteCard);
  });
}

// إنشاء بطاقة ملاحظة
function createNoteCard(note) {
  const noteCard = document.createElement('div');
  noteCard.className = 'note-card';
  noteCard.dataset.id = note.id;
  noteCard.dataset.color = note.color;
  noteCard.style.backgroundColor = `var(--color-${note.color})`;
  
  const date = new Date(note.date);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  
  noteCard.innerHTML = `
    <div class="note-card-content">
      <h3 class="note-card-title">${note.title}</h3>
      <p class="note-card-text">${note.content}</p>
      <div class="note-card-date">${formattedDate}</div>
    </div>
    <div class="note-card-actions">
      <button class="edit-note" data-id="${note.id}">تعديل</button>
      <button class="delete-note" data-id="${note.id}">حذف</button>
    </div>
  `;
  
  // إضافة مستمعي الأحداث
  noteCard.querySelector('.edit-note').addEventListener('click', () => {
    showEditModal(note);
  });
  
  noteCard.querySelector('.delete-note').addEventListener('click', () => {
    showDeleteModal(note.id);
  });
  
  return noteCard;
}

// عرض نافذة التعديل
export function showEditModal(note) {
  const modal = document.getElementById('edit-modal');
  const titleInput = document.getElementById('edit-title');
  const contentInput = document.getElementById('edit-content');
  const saveButton = document.getElementById('save-edit');
  const cancelButton = document.getElementById('cancel-edit');
  const closeButton = modal.querySelector('.close-modal');
  
  // تخزين معرف الملاحظة في النافذة
  modal.dataset.noteId = note.id;
  
  titleInput.value = note.title;
  contentInput.value = note.content;
  
  // تحديد اللون المحدد
  const colorButtons = modal.querySelectorAll('.color-option');
  colorButtons.forEach(btn => {
    btn.classList.remove('selected');
    if (btn.dataset.color === note.color) {
      btn.classList.add('selected');
    }
  });
  
  // إضافة مستمعي الأحداث للألوان
  colorButtons.forEach(btn => {
    btn.onclick = function() {
      colorButtons.forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    };
  });
  
  // إظهار النافذة
  modal.style.display = 'flex';
  
  // التركيز على حقل العنوان
  setTimeout(() => {
    titleInput.focus();
  }, 100);
  
  // إضافة مستمعي الأحداث
  const handleSave = () => {
    let selectedColor = note.color;
    colorButtons.forEach(btn => {
      if (btn.classList.contains('selected')) {
        selectedColor = btn.dataset.color;
      }
    });
    
    const updatedNote = {
      title: titleInput.value.trim() || 'بدون عنوان',
      content: contentInput.value.trim(),
      color: selectedColor
    };
    
    if (updateNote(note.id, updatedNote)) {
      const notes = getNotes();
      renderNotes(notes);
      closeAllModals();
      showNotification('تم تحديث الملاحظة بنجاح');
    }
  };
  
  // إزالة مستمعي الأحداث السابقة
  saveButton.onclick = handleSave;
  cancelButton.onclick = closeAllModals;
  closeButton.onclick = closeAllModals;
}

// عرض نافذة تأكيد الحذف
export function showDeleteModal(noteId) {
  const modal = document.getElementById('delete-modal');
  const confirmButton = document.getElementById('confirm-delete');
  const cancelButton = document.getElementById('cancel-delete');
  const closeButton = modal.querySelector('.close-modal');
  
  // تخزين معرف الملاحظة في النافذة
  modal.dataset.noteId = noteId;
  
  // إظهار النافذة
  modal.style.display = 'flex';
  
  // إضافة مستمعي الأحداث
  const handleDelete = () => {
    if (deleteNote(parseInt(noteId))) {
      const notes = getNotes();
      renderNotes(notes);
      updateNotesCount(notes.length);
      closeAllModals();
      showNotification('تم حذف الملاحظة بنجاح');
    }
  };
  
  // إزالة مستمعي الأحداث السابقة
  confirmButton.onclick = handleDelete;
  cancelButton.onclick = closeAllModals;
  closeButton.onclick = closeAllModals;
}

// إغلاق جميع النوافذ المنبثقة
export function closeAllModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.style.display = 'none';
  });
}

// عرض إشعار
export function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// تحديث عدد الملاحظات
export function updateNotesCount(count) {
  document.getElementById('notes-count').textContent = count;
}
