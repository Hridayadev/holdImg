# HoldImg

HoldImg is a lightweight file clipboard and drag-and-drop tool built with Electron. It allows you to temporarily store and preview files, and drag them into other applications like Messenger or Explorer—without copying or duplicating the original files.

![HoldImg Logo](assets/icon.png)

## Features

- 🖱 Drag files in to store and preview them.
- 📎 Files are referenced, not copied—saving space.
- 💡 Preview stored files directly from the app.
- 🔁 Drag files back out into other apps with original file paths.
- 🔑 Global shortcut (Ctrl+K or Cmd+K) to toggle the app.

## Installation

### For Users
Download the latest release:

📦 **[HoldImg Setup 1.0.0.exe](https://drive.google.com/drive/folders/1Uew7Va-rg5jd0FWp4c-KVABTf9DvwQ3t?usp=sharing)**  
Double-click the installer and follow the prompts.

> ✅ Only this `.exe` file is needed to install the app. No other files required.

### Requirements
- Windows 10 or newer
- Internet not required after installation

## Usage

- **Start** the app using the shortcut `Ctrl+K` (or `Cmd+K` on macOS).
- **Drag** files from your desktop or File Explorer into the app window.
- **Preview** the files inside the app.
- **Drag** them back out to paste or send via chat, email, etc.

## Build from Source (for Developers)

```bash
git clone https://github.com/yourusername/holdimg.git
cd holdimg
npm install
npm run build
