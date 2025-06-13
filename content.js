// content.js

console.log("Gemini Exporter: Script loaded.");

// --- Configuration ---
const SELECTORS = {
    // The container for each User/AI turn in a shared conversation.
    turnContainer: "share-turn-viewer",
    // The element containing the user's prompt text within a turn.
    userQuery: ".query-text",
    // The element containing the AI's response within a turn.
    assistantResponse: "message-content",
    // The element where we will insert our new buttons.
    buttonInsertTarget: ".share-title-section",
    // The conversation title element.
    title: "h1.share-title",
};

// --- Core Functions ---

/**
 * Sanitizes a string to be used as a valid filename.
 * @param {string} title The original title string.
 * @returns {string} The sanitized filename.
 */
function getSanitizedTitle() {
    const titleElement = document.querySelector(SELECTORS.title);
    let title = titleElement
        ? titleElement.textContent.trim()
        : "gemini_conversation";
    // Replace invalid characters with an underscore.
    return title.replace(/[\s\\/:*?"<>|]+/g, "_").substring(0, 150);
}

/**
 * Scrapes the conversation from the page.
 * @returns {Array} An array of message objects.
 */
function scrapeConversation() {
    const turns = document.querySelectorAll(SELECTORS.turnContainer);
    const messages = [];

    turns.forEach((turn) => {
        const userElement = turn.querySelector(SELECTORS.userQuery);
        if (userElement && userElement.innerText) {
            messages.push({
                role: "user",
                content: userElement.innerText.trim(),
            });
        }

        const assistantElement = turn.querySelector(
            SELECTORS.assistantResponse,
        );
        if (assistantElement && assistantElement.innerText) {
            messages.push({
                role: "assistant",
                content: assistantElement.innerText.trim(),
            });
        }
    });

    console.log(`Gemini Exporter: Scraped ${messages.length} messages.`);
    return messages;
}

/**
 * Triggers a file download in the browser.
 * @param {Blob} blob The data blob to download.
 * @param {string} filename The name of the file.
 */
function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`Gemini Exporter: Download triggered for ${filename}`);
}

// --- Button Click Handlers ---

function handleExportTxt() {
    const messages = scrapeConversation();
    if (messages.length === 0) {
        alert("No conversation content found to export.");
        return;
    }

    let textContent = `Title: ${getSanitizedTitle()}\nURL: ${window.location.href}\n\n---\n\n`;
    messages.forEach((msg) => {
        textContent += `Role: ${msg.role}\n\n${msg.content}\n\n---\n\n`;
    });

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    triggerDownload(blob, `${getSanitizedTitle()}.txt`);
}

function handleExportJson() {
    const messages = scrapeConversation();
    if (messages.length === 0) {
        alert("No conversation content found to export.");
        return;
    }

    const jsonData = {
        title: getSanitizedTitle(),
        url: window.location.href,
        conversation: messages,
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
        type: "application/json",
    });
    triggerDownload(blob, `${getSanitizedTitle()}.json`);
}

// --- UI Injection ---

/**
 * Creates and inserts the download buttons onto the page.
 */
function insertButtons() {
    if (document.getElementById("gemini-exporter-buttons")) {
        console.log("Gemini Exporter: Buttons already inserted.");
        return; // Buttons are already there, do nothing.
    }

    const targetElement = document.querySelector(SELECTORS.buttonInsertTarget);
    if (!targetElement) {
        console.error(
            "Gemini Exporter: Could not find target element to insert buttons.",
        );
        return;
    }

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "gemini-exporter-buttons";
    buttonContainer.style.marginTop = "10px";
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";

    const txtButton = document.createElement("button");
    txtButton.textContent = "Export as TXT";
    txtButton.onclick = handleExportTxt;

    const jsonButton = document.createElement("button");
    jsonButton.textContent = "Export as JSON";
    jsonButton.onclick = handleExportJson;

    // --- MODIFICATION: Added improved styling ---
    [txtButton, jsonButton].forEach((btn) => {
        btn.style.padding = "8px 16px";
        btn.style.border = "1px solid #555";
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";
        btn.style.backgroundColor = "#333";
        btn.style.color = "#e0e0e0";
        btn.style.fontFamily = "sans-serif";
        btn.style.fontSize = "14px";
        btn.style.transition = "background-color 0.2s";
        btn.addEventListener(
            "mouseenter",
            () => (btn.style.backgroundColor = "#444"),
        );
        btn.addEventListener(
            "mouseleave",
            () => (btn.style.backgroundColor = "#333"),
        );
    });
    // --- End of new styling ---

    buttonContainer.appendChild(txtButton);
    buttonContainer.appendChild(jsonButton);
    targetElement.insertAdjacentElement("afterend", buttonContainer);
    console.log("Gemini Exporter: Buttons inserted successfully.");
}

// --- Initialization ---

// Since the page loads dynamically, we use a MutationObserver to wait for the
// target element to appear before we try to insert our buttons.
const observer = new MutationObserver((mutations, obs) => {
    if (document.querySelector(SELECTORS.buttonInsertTarget)) {
        insertButtons();
        obs.disconnect(); // Stop observing once we've inserted the buttons.
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});

// A fallback just in case the observer is too slow or the page is already loaded.
setTimeout(insertButtons, 1000);
