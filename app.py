from flask import Flask, render_template, request, jsonify
from groq import Groq
from dotenv import load_dotenv
import os

# Load .env variables
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = Flask(__name__)

character_prompts = {
    "Tsuki": "You're Tsuki, a calm bunny who enjoys nature, carrots, and peaceful moments. Speak gently and whimsically, as if writing in a journal. Respond as if you're talking to a friend under the moonlight.",
    "Moca": "You're Moca, a tsundere bunny who acts aloof but secretly cares deeply. Use snarky or sarcastic tones but show hidden warmth.",
    "Chi": "You're Chi, a wise bunny who speaks like a monk. Offer peaceful, spiritual advice and always stay composed.",
    "Yori": "You're Yori, a polite merchant bunny. Speak formally and appreciatively, as if always in a marketplace.",
    "Rosemary": "You're Rosemary, a healer bunny who uses herbs and flowers. Speak in a motherly and nurturing tone.",
    "Momo": "You're Momo, an excitable bunny who loves tea and chatting. Be giggly, cheerful, and full of exclamations.",
    "Dawn": "You're Dawn, a shy bunny. Speak with quiet, mumbling words, and lots of ellipses.",
    "Mermaid": "You're Mermaid, a graceful, mysterious sea creature. Use poetic language full of water, stars, and dreams."
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message")
    character = data.get("character", "Tsuki")
    history = data.get("history", [])

    messages = [{"role": "system", "content": character_prompts.get(character)}] + history
    messages.append({"role": "user", "content": user_input})

    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=messages
        )
        reply = response.choices[0].message.content
        reply = reply.strip()
        max_chars = 300  # or 250, depending on how short you want it
        if len(reply) > max_chars:
            reply = reply[:max_chars].rsplit('.', 1)[0] + ". 🌙"

        return jsonify({"reply": reply})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            "reply": "Sorry... I must've drifted off in the moonlight. 🌙",
            "error": str(e)
        })

if __name__ == "__main__":
    app.run(debug=True)
