# Groq TTS Playground 🎙️

A professional web interface for Groq's lightning-fast Text-to-Speech API. Convert text to natural-sounding speech in seconds using cutting-edge AI models.

![Groq TTS Playground](https://img.shields.io/badge/Groq-TTS-orange?style=for-the-badge&logo=lightning)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.0-green?style=for-the-badge&logo=flask)

## 🌟 Features

- **🔐 Secure API Key Management**: Enter your own Groq API key directly in the frontend
- **⚡ Lightning Fast**: Powered by Groq's LPU architecture for instant audio generation
- **🎤 Multiple Voices**: 19 English and 4 Arabic voices to choose from
- **🎨 Modern UI**: Clean, responsive interface built with Tailwind CSS
- **🔊 Real-time Preview**: Play generated audio instantly in the browser
- **💾 Easy Download**: Save audio files with one click
- **📊 Character Counter**: Track text length (up to 10,000 characters)
- **🔒 Privacy First**: API keys stored locally in browser, never sent to our servers

## 🚀 How Groq TTS Works

Groq's Text-to-Speech system uses a multi-stage pipeline:

1. **Text Preprocessing**: Input text is tokenized and normalized
2. **Acoustic Modeling**: The playai-tts model generates mel-spectrogram features
3. **Vocoding**: Neural vocoder converts spectrograms to waveform audio
4. **LPU Acceleration**: Groq's Lightning Processing Unit delivers 10x faster inference than traditional GPUs

### Why Groq is Faster

Groq's **LPU (Language Processing Unit)** is specifically designed for sequential AI workloads:
- Deterministic execution (no GPU scheduling overhead)
- Optimized memory bandwidth
- Purpose-built for transformer models
- Result: Sub-second audio generation 🚀

## 📋 Prerequisites

- Python 3.8+
- Groq API key (get one at https://console.groq.com/ - FREE tier available!)
- Modern web browser

## ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/groq-tts-playground.git
cd groq-tts-playground
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. No .env file needed! Users enter their API keys in the frontend.

## 🎯 Usage

### Step 1: Start the Backend Server

```bash
python backend.py
```

You should see:
```
🚀 Starting Groq TTS Server...
📝 Server running on: http://localhost:5000
💡 Users will provide their own API keys through the frontend
```

### Step 2: Open the Frontend

Open `frontend.html` in your browser, or serve it:

```bash
# Option 1: Direct open
open frontend.html

# Option 2: Serve with Python
python -m http.server 8000
# Then visit: http://localhost:8000/frontend.html
```

### Step 3: Enter Your API Key

1. Click "Get it for free here" to obtain a Groq API key
2. Paste your API key (starts with `gsk_`)
3. Click "Save Key" - it's stored securely in your browser
4. Start generating speech!

## 🎨 Available Voices

### English (playai-tts)
- **Female**: Arista, Celeste, Cheyenne, Deedee, Gail, Indigo, Mamaw
- **Male**: Atlas, Basil, Briggs, Calum, Chip, Cillian, Fritz, Mason, Mikail, Mitch, Quinn, Thunder

### Arabic (playai-tts-arabic)
- **Male**: Ahmad, Khalid, Nasser
- **Female**: Amira

## 📊 API Endpoints

### Generate Speech
```http
POST /api/generate-speech
Content-Type: application/json

{
  "text": "Your text here",
  "model": "playai-tts",
  "voice": "Fritz-PlayAI",
  "api_key": "gsk_your_api_key_here"
}
```

### Get Available Voices
```http
GET /api/voices
```

### Health Check
```http
GET /health
```

## 🛠️ Tech Stack

- **Backend**: Flask, Groq Python SDK
- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **API**: Groq Cloud API (playai-tts models)
- **Storage**: LocalStorage (browser-based, secure)

## 📝 Example Code

### Python Integration
```python
from groq import Groq

client = Groq(api_key="your-api-key")

response = client.audio.speech.create(
    model="playai-tts",
    voice="Fritz-PlayAI",
    input="Hello! Welcome to Groq TTS."
)

response.write_to_file("output.wav")
```

### JavaScript Integration
```javascript
const response = await fetch('http://localhost:5000/api/generate-speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        text: "Hello World!",
        model: "playai-tts",
        voice: "Fritz-PlayAI",
        api_key: "your-api-key"
    })
});

const blob = await response.blob();
const audioUrl = URL.createObjectURL(blob);
```

## 🔒 Security Features

1. **API Key Storage**: Stored only in browser's LocalStorage
2. **No Server-Side Storage**: API keys never saved on backend
3. **Client-Side Validation**: Key format validated before use
4. **HTTPS Ready**: Deploy with SSL for production
5. **CORS Enabled**: Configurable origin restrictions

## 🚀 Deployment Options

### Option 1: Local Development
```bash
python backend.py
# Frontend: Open frontend.html in browser
```

### Option 2: Production (with Gunicorn)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 backend:app
```

### Option 3: Docker
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY backend.py .
CMD ["python", "backend.py"]
```

### Option 4: Cloud Platforms
- **Heroku**: `heroku create && git push heroku main`
- **Railway**: Connect GitHub repo
- **Render**: Deploy as Web Service
- **PythonAnywhere**: Upload files and configure WSGI

## 📈 Performance Metrics

| Metric | Value |
|--------|-------|
| Average Generation Time | 0.5-1.5s |
| Max Text Length | 10,000 chars |
| Audio Format | WAV (16kHz) |
| Typical File Size | 100-500 KB |
| Supported Languages | English, Arabic |

## 🐛 Troubleshooting

### Issue: "Invalid API key"
- Ensure key starts with `gsk_`
- Check key hasn't expired at console.groq.com
- Try generating a new key

### Issue: "CORS Error"
- Make sure backend is running on port 5000
- Check browser console for errors
- Update `API_BASE_URL` in frontend if needed

### Issue: "No audio generated"
- Check backend logs for errors
- Verify API key has TTS permissions
- Test with simple text first

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this in your projects!

## 🔗 Resources

- [Groq Documentation](https://docs.groq.com)
- [Groq Console](https://console.groq.com)
- [PlayAI TTS Models](https://www.playai.com)
- [Groq API Reference](https://docs.groq.com/api-reference)

## 💡 Use Cases

- 🎧 Audiobook generation
- 🤖 Voice assistants and chatbots
- ♿ Accessibility tools for visually impaired
- 🎮 Game character voices
- 📱 Mobile app voice notifications
- 🎓 E-learning platforms
- 📞 IVR systems and phone menus
- 🎬 Video narration and dubbing

## 📸 Screenshots

### Main Interface
![Main Interface](https://via.placeholder.com/800x400/1f2937/ffffff?text=Groq+TTS+Playground)

### API Key Setup
![API Key Setup](https://via.placeholder.com/800x200/f97316/ffffff?text=Secure+API+Key+Input)

### Audio Generation
![Audio Generation](https://via.placeholder.com/800x300/1f2937/ffffff?text=Lightning+Fast+Results)

## 🎯 Roadmap

- [ ] Add voice preview samples
- [ ] Support for SSML (Speech Synthesis Markup Language)
- [ ] Batch text-to-speech processing
- [ ] Export to multiple formats (MP3, OGG)
- [ ] Voice cloning support (when available)
- [ ] Real-time streaming TTS
- [ ] Pronunciation dictionary
- [ ] Multi-language support expansion

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/groq-tts-playground/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/groq-tts-playground/discussions)
- **LinkedIn**: [Your Profile](https://linkedin.com/in/yourprofile)
- **Twitter**: [@yourhandle](https://twitter.com/yourhandle)

## 🙏 Acknowledgments

- [Groq](https://groq.com) for the amazing TTS API
- [PlayAI](https://www.playai.com) for the voice models
- [Tailwind CSS](https://tailwindcss.com) for the beautiful UI framework
- The open-source community for inspiration

## ⭐ Show Your Support

If this project helped you, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📢 Sharing with others