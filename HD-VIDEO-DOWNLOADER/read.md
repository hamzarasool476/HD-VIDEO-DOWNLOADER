# 🎬 HD Video Downloader

A modern, responsive, frontend-only **HD Video Downloader** built with:

* HTML5
* CSS3
* JavaScript
* Bootstrap 5
* Bootstrap Icons

The application provides a clean interface for analyzing and downloading **publicly accessible direct media files** in the original quality supplied by the source.

---

## ✨ Features

### 🎥 Video Features

* Paste a direct media URL
* Analyze media URL
* Detect file extension
* Detect media format
* Detect file size when the source exposes it
* Video preview
* Original / best available quality
* Direct browser download
* Download progress indicator
* Automatic filename detection
* Supports common media formats

### 📁 Supported Formats

The application can work with publicly accessible files such as:

* MP4
* WebM
* OGG / OGV
* MOV
* M4V
* MP3
* M4A
* WAV

Actual browser support depends on the source server and browser.

---

## 🎨 UI Features

The interface includes:

* Modern SaaS-style design
* Responsive layout
* Bootstrap 5
* Bootstrap Icons
* Gradient hero section
* Modern cards
* Loading animations
* Progress bar
* Toast notifications
* Error notifications
* Dark mode
* Light mode
* Mobile-friendly design
* Tablet support
* Desktop support

---

## 📜 Download History

The application stores the last 10 downloads in the browser's `localStorage`.

The history contains:

* Video name
* Format
* File size
* Download date/time

You can clear the history using the **Clear** button.

No database is required.

---

# 📂 Project Structure

```text
hd-video-downloader/
│
├── index.html
├── style.css
└── script.js
```

### `index.html`

Contains:

* Navbar
* Hero section
* URL input
* Analyze button
* Video preview
* Quality selector
* Format selector
* Download button
* Progress bar
* Features section
* Download history
* Footer
* Bootstrap integration

### `style.css`

Contains all custom styling:

* Colors
* Dark mode
* Responsive design
* Cards
* Buttons
* Hero section
* Animations
* Video preview
* Mobile layout

### `script.js`

Contains application functionality:

* URL validation
* Media analysis
* File extension detection
* File-size detection
* Video preview
* Download handling
* Download progress
* LocalStorage history
* Dark/light mode
* Toast messages
* Error handling

---

# 🚀 Installation

No Node.js or backend server is required.

### Step 1 — Download the project

Download or copy the project files.

### Step 2 — Create a folder

Create:

```text
hd-video-downloader
```

### Step 3 — Add the files

Place these files inside:

```text
index.html
style.css
script.js
```

Your folder should look like:

```text
hd-video-downloader/
│
├── index.html
├── style.css
└── script.js
```

### Step 4 — Open the application

Double-click:

```text
index.html
```

The application will open in your browser.

---

# 🌐 Bootstrap

This project uses Bootstrap through CDN.

The following Bootstrap CSS is loaded:

```html
https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/boot
```