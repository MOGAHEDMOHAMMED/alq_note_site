/**
 * الملف الرئيسي للتطبيق
 * هذا الملف يحتوي على الوظائف الرئيسية وربط الأحداث
 */

import { saveNote, getNotes } from './storage.js';
import { renderNotes, showEditModal, showDeleteModal, closeAllModals, showNotification, updateNotesCount } from './ui.js';

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
  // تحميل الملاحظات المخزنة
  const notes = getNotes();
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
  
  // إضافة مستمعي الأحداث للألوان في منطقة إضافة الملاحظة
  setupColorPalette();
});

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
    updateNotesCount(`${filteredNotes.length} (نتائج البحث)`);
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
  
  // إعداد لوحة الألوان في نافذة التعديل
  const editColorButtons = document.querySelectorAll('#edit-modal .color-option');
  editColorButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      editColorButtons.forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
}
