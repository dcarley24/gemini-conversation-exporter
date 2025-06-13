# Gemini Conversation Exporter

A simple, reliable Chrome extension that adds **"Export as TXT"** and **"Export as JSON"** buttons directly onto Gemini's public share pages.

---

## The Problem

Saving a full, structured copy of a Google Gemini conversation is surprisingly difficult.

- The main Gemini chat interface is a dynamic web app with strict security policies.
- Programmatic scraping is unreliable or outright blocked.
- Copy-paste methods result in messy, unstructured text that loses the distinction between user and assistant.

---

## The Solution

This extension targets the one clean, static version of a Gemini conversation: the **public share page**.

It adds export buttons directly to this page—no popups, no scraping hacks.

---

## How It Works

1. **Share Your Chat**  
   In Gemini, click **"Share & Export"** → **"Create public link."**

2. **Open the Link**  
   Open the new `https://gemini.google.com/share/...` URL in a tab.

3. **Export**  
   You'll see **"Export as TXT"** and **"Export as JSON"** buttons below the title.  
   Click either to download your conversation.

---

## Features

- **One-Click Exports** – Buttons appear directly on the page, no config needed.
- **Clean TXT Output** – Formatted with `Role: user` and `Role: assistant` headers.
- **Developer-Ready JSON** – Perfect for RAG systems, knowledge bases, or backups.
- **Stable and CSP-Friendly** – Uses the static share page to avoid Gemini's CSP restrictions.

---

## Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top-right toggle).
4. Click **"Load unpacked"** and select the `gemini-conversation-exporter` folder.
5. Visit any `gemini.google.com/share/...` link — the exporter will activate automatically.

---

## Why This Approach?

The Gemini app page (`/app/...`) uses an aggressive [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) that blocks most script-based extensions.

Rather than fight that, this extension works **with** Gemini’s architecture by targeting the shareable version — a static, safe-to-parse page with minimal restrictions.

---

> Built for clarity, not complexity. This extension keeps your AI conversations structured and accessible.
