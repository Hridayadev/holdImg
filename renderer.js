const { ipcRenderer, clipboard } = require('electron');
const fs = require('fs');
const path = require('path');

let files = [];
const fileList = document.getElementById('fileList');
const dropzone = document.getElementById('dropzone');
const viewModeToggle = document.getElementById('viewModeToggle');
let viewMode = localStorage.getItem('viewMode') || 'individual';
viewModeToggle.value = viewMode;

function renderFiles() {
  fileList.innerHTML = '';
  fileList.className = viewMode === 'stack' ? 'stack-view' : '';

  files.forEach((file, index) => {
    const tile = document.createElement('div');
    tile.className = 'file-tile';
    tile.draggable = true;

    if (file.type.startsWith('image')) {
      const img = document.createElement('img');
      img.src = file.preview;
      img.className = 'thumb';
      tile.appendChild(img);
    } else {
      tile.textContent = file.name;
    }

    const removeBtn = document.createElement('span');
    removeBtn.textContent = '×';
    removeBtn.className = 'remove-btn';
    removeBtn.onclick = () => {
      files.splice(index, 1);
      renderFiles();
    };
    tile.appendChild(removeBtn);

    tile.ondragstart = (e) => {
      e.preventDefault();
      ipcRenderer.send('start-drag', [file.path]);
    };

    tile.onclick = () => {
      clipboard.writeText(file.path);
      ipcRenderer.send('preview-file', file.path);
    };

    fileList.appendChild(tile);
  });

  if (viewMode === 'stack' && files.length > 0) {
    fileList.ondragstart = (e) => {
      e.preventDefault();
      ipcRenderer.send('start-drag', files.map(f => f.path));
    };
    fileList.onclick = () => {
      clipboard.writeText(files.map(f => f.path).join('\n'));
    };
  }
}

function addFiles(fileListObj) {
  for (const file of fileListObj) {
    const ext = path.extname(file.path).toLowerCase();
    const buffer = fs.readFileSync(file.path);
    const base64 = buffer.toString('base64');
    const preview = file.type.startsWith('image') ? `data:${file.type};base64,${base64}` : '';
    files.push({ name: file.name, path: file.path, type: file.type, preview });
  }
  renderFiles();
}

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  addFiles(e.dataTransfer.files);
});

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
});

document.addEventListener('paste', (e) => {
  const fileList = Array.from(e.clipboardData.files || []);
  if (fileList.length > 0) addFiles(fileList);
});

viewModeToggle.addEventListener('change', (e) => {
  viewMode = e.target.value;
  localStorage.setItem('viewMode', viewMode);
  renderFiles();
});

