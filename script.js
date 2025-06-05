// إصلاح مشكلة عدم تحميل ملفات JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // تحميل الملاحظات المخزنة
  const notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
  
  // عرض الملاحظات
  renderNotes(notes);
  updateNotesCount(notes.length);
  
  // إضافة ملاحظة جديدة
  const addNoteBtn = document.getElementById('add-note');
  addNoteBtn.addEventListener('click', handleAddNote);
  
  // البحث في الملاحظات
  const searchInput = document.getElementById('search-notes');
  searchInput.addEventListener('input', handleSearch);
  
  // ترتيب الملاحظات
  const sortSelect = document.getElementById('sort-notes');
  sortSelect.addEventListener('change', handleSort);
  
  // تبديل الوضع (ليلي/نهاري)
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', toggleTheme);
  
  // تحميل الوضع المفضل من localStorage
  loadThemePreference();
  
  // إعداد لوحة الألوان
  setupColorPalette();
});

// وظائف التخزين المحلي
function getNotes() {
  const notes = localStorage.getItem('notes');
  return notes ? JSON.parse(notes) : [];
}

function saveNote(note) {
  const notes = getNotes();
  notes.push(note);
  localStorage.setItem('notes', JSON.stringify(notes));
}

function updateNote(id, updatedNote) {
  const notes = getNotes();
  const index = notes.findIndex(note => note.id === parseInt(id));
  
  if (index !== -1) {
    notes[index] = { ...notes[index], ...updatedNote };
    localStorage.setItem('notes', JSON.stringify(notes));
    return true;
  }
  
  return false;
}

function deleteNote(id) {
  const notes = getNotes();
  const filteredNotes = notes.filter(note => note.id !== parseInt(id));
  
  if (filteredNotes.length !== notes.length) {
    localStorage.setItem('notes', JSON.stringify(filteredNotes));
    return true;
  }
  
  return false;
}

// وظائف واجهة المستخدم
function renderNotes(notes) {
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

function showEditModal(note) {
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
  saveButton.onclick = function() {
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
  
  cancelButton.onclick = closeAllModals;
  closeButton.onclick = closeAllModals;
}

function showDeleteModal(noteId) {
  const modal = document.getElementById('delete-modal');
  const confirmButton = document.getElementById('confirm-delete');
  const cancelButton = document.getElementById('cancel-delete');
  const closeButton = modal.querySelector('.close-modal');
  
  // تخزين معرف الملاحظة في النافذة
  modal.dataset.noteId = noteId;
  
  // إظهار النافذة
  modal.style.display = 'flex';
  
  // إضافة مستمعي الأحداث
  confirmButton.onclick = function() {
    if (deleteNote(parseInt(noteId))) {
      const notes = getNotes();
      renderNotes(notes);
      updateNotesCount(notes.length);
      closeAllModals();
      showNotification('تم حذف الملاحظة بنجاح');
    }
  };
  
  cancelButton.onclick = closeAllModals;
  closeButton.onclick = closeAllModals;
}

function closeAllModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.style.display = 'none';
  });
}

function showNotification(message) {
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

function updateNotesCount(count) {
  document.getElementById('notes-count').textContent = count;
}

// وظائف التطبيق الرئيسية
function handleAddNote() {
  const titleInput = document.getElementById('note-title');
  const contentInput = document.getElementById('note-content');
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  
  if (content === '') {
    showNotification('يرجى إدخال محتوى الملاحظة');
    return;
  }
  
  const colorButtons = document.querySelectorAll('.note-input .color-option');
  let selectedColor = 'default';
  
  colorButtons.forEach(btn => {
    if (btn.classList.contains('selected')) {
      selectedColor = btn.dataset.color;
    }
  });
  
  const newNote = {
    id: Date.now(),
    title: title || 'بدون عنوان',
    content,
    color: selectedColor,
    date: new Date().toISOString()
  };
  
  saveNote(newNote);
  const notes = getNotes();
  renderNotes(notes);
  updateNotesCount(notes.length);
  
  // إعادة تعيين حقول الإدخال
  titleInput.value = '';
  contentInput.value = '';
  
  // إعادة تعيين اللون المحدد إلى الافتراضي
  colorButtons.forEach(btn => {
    btn.classList.remove('selected');
    if (btn.dataset.color === 'default') {
      btn.classList.add('selected');
    }
  });
  
  // إظهار إشعار نجاح الإضافة
  showNotification('تمت إضافة الملاحظة بنجاح');
}

function handleSearch() {
  const searchTerm = document.getElementById('search-notes').value.toLowerCase();
  const notes = getNotes();
  
  if (searchTerm === '') {
    renderNotes(notes);
    return;
  }
  
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm) || 
    note.content.toLowerCase().includes(searchTerm)
  );
  
  renderNotes(filteredNotes);
  
  // تحديث عدد النتائج
  if (filteredNotes.length !== notes.length) {
    updateNotesCount(filteredNotes.length);
    document.querySelector('.notes-count').textContent = `${filteredNotes.length} نتيجة بحث`;
  } else {
    updateNotesCount(notes.length);
  }
}

function handleSort() {
  const sortBy = document.getElementById('sort-notes').value;
  const notes = getNotes();
  
  let sortedNotes = [...notes];
  
  switch (sortBy) {
    case 'newest':
      sortedNotes.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'oldest':
      sortedNotes.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'title':
      sortedNotes.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
      break;
  }
  
  renderNotes(sortedNotes);
}

function toggleTheme() {
  document.body.classList.add('theme-transition');
  const isDarkMode = document.body.classList.toggle('dark-theme');
  
  // حفظ تفضيل الوضع في localStorage
  localStorage.setItem('darkMode', isDarkMode);
  
  // تحديث أيقونة الوضع
  const themeIcon = document.querySelector('.theme-icon');
  themeIcon.classList.toggle('dark-icon', isDarkMode);
  themeIcon.classList.toggle('light-icon', !isDarkMode);
  
  // إظهار إشعار
  showNotification(isDarkMode ? 'تم تفعيل الوضع الليلي' : 'تم تفعيل الوضع النهاري');
}

function loadThemePreference() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark-theme');
    document.querySelector('.theme-icon').classList.add('dark-icon');
  } else {
    document.querySelector('.theme-icon').classList.add('light-icon');
  }
}

function setupColorPalette() {
  // إعداد لوحة الألوان في منطقة إضافة الملاحظة
  const colorButtons = document.querySelectorAll('.note-input .color-option');
  colorButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      colorButtons.forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
  
  // تحديد اللون الافتراضي
  colorButtons[0].classList.add('selected');
}
