const API_BASE_URL = 'http://localhost:5000';
const API_KEY_STORAGE = 'groq_api_key'; // NOTE: KEEP this name for localStorage compatibility

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

// API Key Elements
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
    if (!apiKey) return showError('Please enter a processing key.');
    // Keep internal check for gsk_ but provide a non-branded message
    if (!apiKey.startsWith('gsk_')) return showError('Invalid key format. Processing keys usually start with "gsk_"'); 
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
    
    if (!apiKey) return showError('Please enter your processing key first.');
    if (!text) return showError('Please enter some text.');

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
            // Rebranded error message
            throw new Error(error.error || 'TextSprache Engine failed to process speech.');
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
        showError(error.message || 'Processing failed. Check your key and try again.');
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
        // Add spinner to the button
        generateBtn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="animation: spin 1s linear infinite; width: 20px; height: 20px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Generating...
        `;
        // Inject spin animation CSS if not present
        if (!document.getElementById('spin-style')) {
            const style = document.createElement('style');
            style.id = 'spin-style';
            style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
            document.head.appendChild(style);
        }
    } else {
        // Reset button state
        generateBtn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 20px; height: 20px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072"/>
            </svg>
            Generate Speech
        `;
    }
}