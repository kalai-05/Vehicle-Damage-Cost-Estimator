import google.generativeai as genai
from flask import Flask, request, jsonify

# Configure with current recommended model
genai.configure(api_key="AIzaSyAY1JnGwNqOfT1uOEU1GSm-xvwzbIKWVWc")

# Current working models (July 2024)
MODEL_NAME = 'gemini-1.5-flash'  # Fast and affordable
# MODEL_NAME = 'gemini-1.5-pro'  # More capable but slower

model = genai.GenerativeModel(MODEL_NAME)

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def handle_chat():
    try:
        user_message = request.json.get('message')
        if not user_message:
            return jsonify({"error": "Message is required"}), 400
            
        response = model.generate_content(user_message)
        return jsonify({
            "response": response.text,
            "model_used": MODEL_NAME
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000, debug=True)