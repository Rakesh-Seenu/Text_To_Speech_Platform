const API_BASE_URL = 'http://localhost:5000';
const API_KEY_STORAGE = 'groq_api_key';

const voices = {
    english: ['Arista-PlayAI', 'Atlas-PlayAI', 'Basil-PlayAI', 'Briggs-PlayAI', 'Calum-PlayAI', 
             'Celeste-PlayAI', 'Cheyenne-PlayAI', 'Chip-PlayAI', 'Cillian-PlayAI', 'Deedee-PlayAI', 
             'Fritz-PlayAI', 'Gail-PlayAI', 'Indigo-PlayAI', 'Mamaw-PlayAI', 'Mason-PlayAI', 
             'Mikail-PlayAI', 'Mitch-PlayAI', 'Quinn-PlayAI', 'Thunder-PlayAI'],
    arabic: ['Ahmad-PlayAI', 'Amira-PlayAI', 'Khalid-PlayAI', 'Nasser-PlayAI']
};

// DOM Elements
const textInput = document.getElementById('textInput');
const charCount = document.getElementById('charCount');
const generateBtn = document.getElementById('generateBtn');
const modelSelect = document.getElementById('modelSelect');
const voiceSelect = document.getElementById('voiceSelect');
const resultSection = document.getElementById('resultSection');
const audioPlayer = document.getElementById('audioPlayer');
const errorMessage = document.getElementById('errorMessage');
const genTime = document.getElementById('genTime');
const fileSize = document.getElementById('fileSize');
const downloadBtn = document.getElementById('downloadBtn');
const playBtn = document.getElementById('playBtn');
const apiKeySection = document.getElementById('apiKeySection');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
const apiKeySuccess = document.getElementById('apiKeySuccess');
const changeApiKeyBtn = document.getElementById('changeApiKeyBtn');

// On Load
window.addEventListener('load', () => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE);
    if (savedKey) {
        apiKeyInput.value = savedKey;
        showApiKeySuccess();
    }
    updateVoices();
});

// Event Listeners
saveApiKeyBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) return showError('Please enter an API key');
    if (!apiKey.startsWith('gsk_')) return showError('Invalid API key format.');
    localStorage.setItem(API_KEY_STORAGE, apiKey);
    showApiKeySuccess();
});

changeApiKeyBtn.addEventListener('click', () => {
    apiKeySuccess.classList.add('hidden');
    apiKeySection.classList.remove('hidden');
    apiKeyInput.value = '';
    apiKeyInput.focus();
    generateBtn.disabled = true;
});

textInput.addEventListener('input', () => {
    charCount.textContent = `${textInput.value.length} / 10,000 characters`;
});

modelSelect.addEventListener('change', updateVoices);

playBtn.addEventListener('click', () => audioPlayer.play());

generateBtn.addEventListener('click', async () => {
    const text = textInput.value.trim();
    const apiKey = localStorage.getItem(API_KEY_STORAGE);
    
    if (!apiKey) return showError('Please enter your API key first');
    if (!text) return showError('Please enter some text');

    setLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-speech`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text,
                model: modelSelect.value,
                voice: voiceSelect.value,
                api_key: apiKey
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate speech');
        }

        const generationTime = response.headers.get('X-Generation-Time');
        const fileSizeKb = response.headers.get('X-File-Size');
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        
        audioPlayer.src = audioUrl;
        downloadBtn.href = audioUrl;
        genTime.textContent = `${parseFloat(generationTime).toFixed(2)}s`;
        fileSize.textContent = `${parseFloat(fileSizeKb).toFixed(1)} KB`;
        
        resultSection.classList.remove('hidden');
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
});

// Helper Functions
function updateVoices() {
    const model = modelSelect.value;
    const voiceList = model === 'playai-tts' ? voices.english : voices.arabic;
    voiceSelect.innerHTML = voiceList.map(voice => 
        `<option value="${voice}">${voice}</option>`
    ).join('');
}

function showApiKeySuccess() {
    apiKeySection.classList.add('hidden');
    apiKeySuccess.classList.remove('hidden');
    generateBtn.disabled = false;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => errorMessage.classList.add('hidden'), 5000);
}

function setLoading(isLoading) {
    generateBtn.disabled = isLoading;
    if (isLoading) {
        errorMessage.classList.add('hidden');
        resultSection.classList.add('hidden');
        generateBtn.textContent = "Generating...";
    } else {
        generateBtn.textContent = "Generate Speech";
    }
}