# Fake chat UI  
[https://bsaldivaremc2.github.io/pseudowhatsapp/](https://bsaldivaremc2.github.io/pseudowhatsapp/)


# Chat Command System

This project implements a simple command-driven chat interface with support for users, system messages, typing indicators, and script playback.

---

## 📁 Setup

* User avatars are loaded from `./users/`
* A `users.json` file should contain a list of image filenames (e.g., `john_doe.png`)

Example:

```json
["john_doe.png", "jane_smith.png"]
```

Usernames are derived from filenames:

* `john_doe.png` → `john doe`

---

## 💬 Available Commands

Commands are entered into the input box and executed by pressing **Enter**.

### 1. `/message`

Send a message from a user.

**Syntax:**

```
/message "username" "message text"
```

**Example:**

```
/message "John Doe" "Hello everyone!"
```

---

### 2. `/chat_name`

Change the chat title.

**Syntax:**

```
/chat_name "New Chat Title"
```

**Example:**

```
/chat_name "Project Discussion"
```

---

### 3. `/user_is_typing`

Display a typing indicator for a user.

**Syntax:**

```
/user_is_typing "username" seconds
```

**Example:**

```
/user_is_typing "Jane Smith" 3
```

---

### 4. `/user_added`, `/user_removed`, `/user_left`

Display system messages for user activity.

**Syntax:**

```
/user_added "username"
/user_removed "username"
/user_left "username"
```

**Example:**

```
/user_added "John Doe"
```

---

### 5. `/clear_chat`

Clear all messages from the chat.

**Syntax:**

```
/clear_chat
```

---

### 6. `/play_script`

Play a script file containing multiple commands.

**Syntax:**

```
/play_script "filename" delaySeconds
```

* `delaySeconds` is optional (default = 1 second)

**Example:**

```
/play_script "script.txt" 2
```

---

## 📜 Script Formats

Scripts can be written in **TXT** or **JSON** format.

---

### TXT Script

* Each line is treated as a command
* Empty lines and lines starting with `#` are ignored

**Example (`script.txt`):**

```
# Sample script
/user_added "John Doe"
/message "John Doe" "Hi!"
/message "Jane Smith" "Hello!"
```

---

### JSON Script

More advanced control with delays and typing indicators.

**Structure:**

```json
[
  {
    "typing": { "user": "John Doe", "seconds": 2 },
    "command": "/message \"John Doe\" \"Hello!\"",
    "delay": 2
  }
]
```

**Fields:**

* `typing` (optional): shows typing indicator
* `command` (optional): command to execute
* `delay` (optional): delay before next step

---

## 🖼️ Image Paste Support

* You can paste images directly into the chat
* Images will appear inline with a max width of 200px

---

## ⚙️ Notes

* Usernames are **case-insensitive**
* Quotes (`" "`) are required for names and messages with spaces
* Unknown users will trigger a system message
* Only one script can run at a time

---

## 🚀 Quick Example

```
/user_added "John Doe"
/user_is_typing "John Doe" 2
/message "John Doe" "Hey there!"
```

---

## 📌 Summary

This system allows you to:

* Simulate chat conversations
* Automate messages via scripts
* Display user activity and typing
* Customize chat dynamically

Perfect for demos, storytelling, or UI prototyping.
