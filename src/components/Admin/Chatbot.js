import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5005/webhooks/rest/webhook",
        {
          sender: "user",
          message: message,
        }
      );
      console.log("Rasa server response:", response.data);

      const botResponses = [];

      if (Array.isArray(response.data)) {
        response.data.forEach((item) => {
          if (item.text) {
            botResponses.push(item.text);
          }
        });
      } else {
        console.error(
          "Unexpected response format from Rasa server:",
          response.data
        );
        botResponses.push("Sorry, I encountered an error.");
      }

      if (botResponses.length > 0) {
        const conversationUpdate = botResponses.map((botResponse) => ({
          user: message,
          bot: botResponse,
        }));
        setConversation([...conversation, ...conversationUpdate]);
      } else {
        setConversation([
          ...conversation,
          { user: message, bot: "Sorry, I didn't understand that." },
        ]);
      }
    } catch (error) {
      console.error("Error communicating with Rasa server:", error);
      setConversation([
        ...conversation,
        { user: message, bot: "Sorry, I encountered an error." },
      ]);
    }
    setMessage("");
  };

  return (
    <div className="chatbot">
      <div className="chatbot-messages">
        {conversation.map((msg, index) => (
          <div key={index}>
            <p className="user-message">{msg.user}</p>
            <p className="bot-message">{msg.bot}</p>
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
