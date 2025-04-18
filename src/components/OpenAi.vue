
<template>
  <div>
    <!-- Chat Button -->
    <button class="btn" @click="handleChatButtonClick">
      <svg
        id="ic_bubble"
        fill="#FFFFFF"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
        ></path>
        <path d="M0 0h24v24H0z" fill="none"></path>
      </svg>
    </button>

    <!-- Chat Box -->
    <div class="chat-box" v-show="isChatVisible">
      <div class="header">
        <h1>Hi there 👋</h1>
        <button class="close-btn" @click="toggleChat">
          <i class="fa-solid fa-angle-down"></i>
        </button>
      </div>

      <div class="messages" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="{
            'user-message': message.sender === 'user',
            'bot-message': message.sender === 'bot',
          }"
        >
          <span v-if="message.text">{{ message.text }}</span>
        </div>
      </div>

      <div class="chat-input">
        <input
          type="text"
          v-model="userMessage"
          placeholder="Type a message..."
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage">
          <i class="fa-solid fa-paper-plane send-icon"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ChatBox",
  data() {
    return {
      isChatVisible: false,
      userMessage: "",
      messages: [{ text: "Hello! How can I help you?", sender: "bot" }],
      sessionId: null,
    };
  },
  methods: {
    handleChatButtonClick() {
      this.isChatVisible = !this.isChatVisible;
      const chatbotURL = `${window.location.origin}/?openChat=true`;
      const newTab = window.open(chatbotURL, "_blank");
      if (newTab) {
        newTab.onload = () => {
          newTab.postMessage({ action: "openChat" }, window.location.origin);
        };
      }
    },

    toggleChat() {
      this.isChatVisible = !this.isChatVisible;
    },

    async sendMessage() {
      if (this.userMessage.trim() === "") return;

      this.messages.push({ text: this.userMessage, sender: "user" });
      const userMessageCopy = this.userMessage;
      this.userMessage = "";

      const botMessage = { text: "", sender: "bot", isLoading: true };
      this.messages.push(botMessage);
      this.scrollToBottom();

      try {
        const response = await axios.post(
          "https://4a06-14-195-132-106.ngrok-free.app/chat",
          {
            user_question: userMessageCopy,
            session_id: this.sessionId,
            stream: true,
          }
        );
        botMessage.isLoading = false;
        await this.streamResponse(botMessage, response.data);
      } catch (error) {
        botMessage.text = "Error fetching response. Please try again.";
        botMessage.isLoading = false;
      } finally {
        this.scrollToBottom();
      }
    },

    async streamResponse(botMessage, fullText) {
      botMessage.text = "";
      for (let i = 0; i < fullText.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        botMessage.text += fullText[i];
        this.scrollToBottom();
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
  },
  mounted() {
    this.sessionId = crypto.randomUUID();

    window.addEventListener("message", (event) => {
      console.log("Received message:", event.data);
      if (event.origin !== window.location.origin) return;
      if (event.data.action === "openChat") {
        this.isChatVisible = true;
      }
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get("openChat") === "true") {
      this.isChatVisible = true;
    }
  },
};
</script>
<style scoped>
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: red;
  border-radius: 50%;
  height: 70px;
  width: 70px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  box-shadow: 0px 4px 6px rgba(3, 238, 54, 0.2);
  cursor: pointer;
  border: none;
}
.btn:hover {
  background-color: darkred;
}

.chat-box {
  position: fixed;
  bottom: 100px;
  right: 20px;
  height: 500px;
  width: 370px;
  border: 2px solid rgb(254, 0, 0);
  border-radius: 10px 10px 0px 0px;
  background-color: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 15px;
  height: 100px;
  font-size: 28px;
  color: white;
  background-color: rgb(254, 0, 0);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.close-btn {
  background: white;
  border: none;
  font-size: 22px;
  color: rgb(254, 0, 0);
  border-radius: 50%;
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}
.close-btn:hover {
  background: #f8d7da;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  max-height: 350px;
  min-height: 350px;
}
.message {
  max-width: 75%;
  padding: 10px 15px;
  border-radius: 15px;
  margin: 5px 0;
  word-wrap: break-word;
}

.user-message {
  align-self: flex-end;
  background-color: rgb(245, 88, 88);
  color: white;
  text-align: right;
}

.bot-message {
  align-self: flex-start;
  background-color: #f1f1f1;
  color: black;
  text-align: left;
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
  background: #fff;
}
.chat-input input {
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  outline: none;
}
.chat-input button {
  margin-left: 10px;
  padding: 10px 15px;
  border: none;
  background: rgb(254, 0, 0);
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
.chat-input button:hover {
  background: darkred;
}
.dots-loader {
  display: inline-block;
  font-size: 0px;
  letter-spacing: 2px;
  animation: blink 1.5s infinite;
}
@keyframes blink {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
</style>
