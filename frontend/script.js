
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");
const clearButton = document.getElementById("clearButton");
const historyButton = document.getElementById("historyButton");
const historyPanel = document.getElementById("historyPanel");
const newChatButton = document.getElementById("newChatButton");

messageInput.addEventListener("input", function () {
    sendButton.disabled = messageInput.value.trim() === "";
});

sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});


clearButton.addEventListener("click", function () {

    const confirmClear = confirm(
        "Are you sure you want to clear the current chat?"
    );

    if (!confirmClear) {
        return;
    }

    chatMessages.innerHTML = "";
    messageInput.value = "";

});

historyButton.addEventListener("click", function () {

    if (historyPanel.style.display === "block") {

        historyPanel.style.display = "none";

    } else {

        historyPanel.style.display = "block";

    }

});

newChatButton.addEventListener("click", function () {

    chatMessages.innerHTML = "";

    messageInput.value = "";

   isNewChat = true;

}); 

async function sendMessage() {

    const message = messageInput.value.trim();

    if (message === "") {
        return;
    }

    sendButton.disabled = true;
    sendButton.innerHTML = "Sending...";

    messageInput.disabled = true;

    // Display user's message
    addMessage(message, "user-message");

    // Clear input box
    messageInput.value = "";

    // Display temporary message
    // addMessage("Thinking...", "bot-message");
    addTypingMessage();

    try {

    const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message
        })
    });

    if(!response.ok){
        throw new Error("Server error");
    }

    const data = await response.json();

    // Remove "Thinking..."
    chatMessages.lastElementChild.remove();

    // Display AI response
    addFormattedMessage(data.reply, "bot-message");;

}

catch(error){

    //remove "Thinking..."
    chatMessages.lastElementChild.remove();

    //display error message
    addMessage(
        "Sorry , something went wrong. Please try again.",
        "bot-message"
    );

    console.error(error);
}

    sendButton.disabled = false;
    sendButton.innerHTML = "Send";

    messageInput.disabled = false;
    messageInput.focus();

}


function addMessage(message, className) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message", className);

    const textDiv = document.createElement("div");
    textDiv.innerText = message;

    const timeDiv = document.createElement("div");

    const now = new Date();

    timeDiv.innerText = now.toLocaleTimeString([],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

    timeDiv.classList.add("message-time");

    messageDiv.appendChild(textDiv);
    messageDiv.appendChild(timeDiv);

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    saveChatHistory();
}



function addFormattedMessage(message, className) {

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", className);

    const textDiv = document.createElement("div");

    // Convert Markdown into HTML and sanitize it
    textDiv.innerHTML = DOMPurify.sanitize(
        marked.parse(message)
    );

    // Find all code blocks in the formatted response
    const codeBlocks = textDiv.querySelectorAll("pre");

    codeBlocks.forEach(function (pre) {

        // Create a container for the code block
        const codeContainer = document.createElement("div");
        codeContainer.classList.add("code-container");

        // Create the Copy Code button
        const copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.classList.add("copy-code-button");
        copyButton.innerText = "Copy Code";

        // Copy the code when the button is clicked
        copyButton.addEventListener("click", async function () {

            const code = pre.querySelector("code");

            if (!code) {
                return;
            }

            try {
                await navigator.clipboard.writeText(code.innerText);

                   copyButton.innerText = "✓ Copied!";
                   copyButton.disabled = true;

           setTimeout(function () {
            
                      copyButton.innerText = "Copy Code";
                      copyButton.disabled = false;
         }, 2000);

            } catch (error) {
                console.error("Unable to copy code:", error);
                copyButton.innerText = "Copy failed";
            }

        });

        // Place the button and code block inside the container
        pre.parentNode.insertBefore(codeContainer, pre);

        codeContainer.appendChild(copyButton);
        codeContainer.appendChild(pre);

    });

    // Create the message timestamp
    const timeDiv = document.createElement("div");

    const now = new Date();

    timeDiv.innerText = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    timeDiv.classList.add("message-time");

    // Add the formatted response and timestamp
    messageDiv.appendChild(textDiv);
    messageDiv.appendChild(timeDiv);

    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Save the conversation to chat history
    saveChatHistory();
}



function addTypingMessage() {

    const typingDiv = document.createElement("div");

    typingDiv.classList.add("message", "bot-message", "typing");

    typingDiv.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    chatMessages.appendChild(typingDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function saveChatHistory() {
       //how many message elements are currently inside the chat
   if (chatMessages.children.length === 0) {
    return;
}
                                //    finds the user's messages.
     const messages = chatMessages.querySelectorAll(".user-message");

    let chatTitle = "New Chat";

  if (messages.length > 0) {

   const firstMessage = messages[0].firstElementChild.innerText;

    if (firstMessage.length > 30) {
        chatTitle = firstMessage.substring(0, 30) + "...";
    } else {
        chatTitle = firstMessage;
    }

}
// Save something in the browser
    localStorage.setItem(
        "chatHistory",
        chatMessages.innerHTML
    );

    localStorage.setItem(
        "chatTitle",
        chatTitle
    );

  saveMultipleChat(
    chatTitle,
    chatMessages.innerHTML
);

     updateHistoryPanel();
}

function loadChatHistory() {

    const savedChat = localStorage.getItem("chatHistory");

    if (savedChat) {

        chatMessages.innerHTML = savedChat;

    }

}

loadChatHistory();


function updateHistoryPanel() {

    const historyList = document.getElementById("historyList");

   const savedChats = JSON.parse(
    localStorage.getItem("chatHistoryList")
) || [];

   if (savedChats.length === 0) {
       historyList.innerHTML = "<p>💬 No previous conversations yet.</p>";
        return;

    }

const chatTitle = localStorage.getItem("chatTitle") || "New Chat";

historyList.innerHTML = "";
          //go through every saved conversation and create a History item for it
savedChats.forEach(function (chat, index) {
    historyList.innerHTML += `
        <div class="history-item" data-index="${index}">
            💬 ${chat.title}
        </div>
    `;
});

const historyItems = document.querySelectorAll(".history-item");

historyItems.forEach(function (item) {

    item.addEventListener("click", function () {

        const index = item.getAttribute("data-index");

        chatMessages.innerHTML = savedChats[index].content;

        chatMessages.scrollTop = chatMessages.scrollHeight;

        historyPanel.style.display = "none";
    });

});

}

updateHistoryPanel();

let isNewChat = false;
                //convert the saved text back into JavaScript data.
let chatHistoryList = JSON.parse(
    localStorage.getItem("chatHistoryList") //get our multiple-chat history.
) || [];  //if there is no history yet, start with an empty list.


function saveMultipleChat(chatTitle, chatContent) {

    const chat = {
        title: chatTitle,
        content: chatContent
    };

    if (isNewChat || chatHistoryList.length === 0) {
    chatHistoryList.push(chat);
    isNewChat = false;
} else {
    chatHistoryList[chatHistoryList.length - 1] = chat;
}

    localStorage.setItem(
        "chatHistoryList",
        JSON.stringify(chatHistoryList)
    );
}

