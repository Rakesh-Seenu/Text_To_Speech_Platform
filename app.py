import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from groq import Groq
import tempfile
import time

app = Flask(__name__)
CORS(app)

# --- SERVE STATIC FILES ---

@app.route('/')
def home():
    return send_file('index.html')

@app.route('/script.js')
def serve_js():
    return send_file('script.js')

@app.route('/style.css')
def serve_css():
    return send_file('style.css')

# --- API ENDPOINTS ---

@app.route('/api/generate-speech', methods=['POST'])
def generate_speech():
    try:
        data = request.json
        text = data.get('text', '')
        model = data.get('model', 'playai-tts')
        voice = data.get('voice', 'Fritz-PlayAI')
        api_key = data.get('api_key', '')
        
        if not api_key: return jsonify({'error': 'API key is required'}), 400
        if not text: return jsonify({'error': 'Text is required'}), 400
        
        client = Groq(api_key=api_key)
        
        # Generate Speech
        start_time = time.time()
        response = client.audio.speech.create(
            model=model,
            voice=voice,
            input=text,
            response_format="wav"
        )
        generation_time = time.time() - start_time
        
        # Create temp file
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_file:
            speech_file_path = tmp_file.name
            response.write_to_file(speech_file_path)
        
        file_size_kb = os.path.getsize(speech_file_path) / 1024

        res = send_file(speech_file_path, mimetype='audio/wav', as_attachment=True, download_name='speech.wav')
        res.headers['X-Generation-Time'] = str(generation_time)
        res.headers['X-File-Size'] = str(file_size_kb)
        return res
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Server running at http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)