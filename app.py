# app.py - Fixed Flask Backend for Groq TTS
import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from groq import Groq
import tempfile
import time

app = Flask(__name__)
CORS(app)

@app.route('/api/generate-speech', methods=['POST'])
def generate_speech():
    try:
        data = request.json
        text = data.get('text', '')
        model = data.get('model', 'playai-tts')
        voice = data.get('voice', 'Fritz-PlayAI')
        api_key = data.get('api_key', '')
        
        if not api_key:
            return jsonify({'error': 'API key is required'}), 400
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        if len(text) > 10000:
            return jsonify({'error': 'Text exceeds 10,000 character limit'}), 400
        
        # Initialize Groq client with user's API key
        try:
            client = Groq(api_key=api_key)
        except Exception as e:
            return jsonify({'error': 'Invalid API key'}), 401
        
        # Create temporary file for audio
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_file:
            speech_file_path = tmp_file.name
        
        # Generate speech using Groq API
        start_time = time.time()
        try:
            response = client.audio.speech.create(
                model=model,
                voice=voice,
                input=text,
                response_format="wav"
            )
        except Exception as e:
            return jsonify({'error': f'Groq API error: {str(e)}'}), 500
            
        generation_time = time.time() - start_time
        
        # Write audio to file
        response.write_to_file(speech_file_path)
        
        # Get file size
# Get file size
        file_size = os.path.getsize(speech_file_path)
        file_size_kb = file_size / 1024

        # Create response with send_file
        response = send_file(
            speech_file_path,
            mimetype='audio/wav',
            as_attachment=True,
            download_name='speech.wav'
        )

        # Add custom headers after creating response
        response.headers['X-Generation-Time'] = str(generation_time)
        response.headers['X-File-Size'] = str(file_size_kb)

        return response
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/voices', methods=['GET'])
def get_voices():
    english_voices = [
        'Arista-PlayAI', 'Atlas-PlayAI', 'Basil-PlayAI', 'Briggs-PlayAI',
        'Calum-PlayAI', 'Celeste-PlayAI', 'Cheyenne-PlayAI', 'Chip-PlayAI',
        'Cillian-PlayAI', 'Deedee-PlayAI', 'Fritz-PlayAI', 'Gail-PlayAI',
        'Indigo-PlayAI', 'Mamaw-PlayAI', 'Mason-PlayAI', 'Mikail-PlayAI',
        'Mitch-PlayAI', 'Quinn-PlayAI', 'Thunder-PlayAI'
    ]
    
    arabic_voices = [
        'Ahmad-PlayAI', 'Amira-PlayAI', 'Khalid-PlayAI', 'Nasser-PlayAI'
    ]
    
    return jsonify({
        'english': english_voices,
        'arabic': arabic_voices
    })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'Groq TTS API'})

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Groq TTS API is running!',
        'endpoints': {
            '/api/generate-speech': 'POST - Generate speech from text',
            '/api/voices': 'GET - List available voices',
            '/health': 'GET - Health check'
        }
    })

if __name__ == '__main__':
    print("🚀 Starting Groq TTS Server...")
    print("📝 Server running on: http://localhost:5000")
    print("💡 Users will provide their own API keys through the frontend")
    print("🌐 CORS enabled for all origins")
    print("\n✅ Backend is ready! Open frontend.html in your browser")
    app.run(debug=True, host='0.0.0.0', port=5000)
