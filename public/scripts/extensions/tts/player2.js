import { getRequestHeaders } from '../../../script.js';
import { getPreviewString, saveTtsProviderSettings } from './index.js';
export { Player2TtsProvider };

class Player2TtsProvider {
    settings;
    voices = [];
    separator = ' . ';
    audioElement = document.createElement('audio');

    defaultSettings = {
        voiceMap: {},
        speed: 1,
        game_key: 'SillyTavern',
    };

    get settingsHtml() {
        let html = `
        <label for="player2_game_key">Game Key</label>
        <input id="player2_game_key" type="text" class="text_pole" placeholder="Game Name"/>
        <label for="player2_speed">Speed: <span id="player2_speed_output"></span></label>
        <input id="player2_speed" type="range" value="1" min="0.25" max="4" step="0.05" />`;
        return html;
    }

    onSettingsChange() {
        this.settings.game_key = String($('#player2_game_key').val());
        this.settings.speed = Number($('#player2_speed').val());
        $('#player2_speed_output').text(this.settings.speed);
        saveTtsProviderSettings();
    }

    async loadSettings(settings) {
        if (Object.keys(settings).length == 0) {
            console.info('Using default TTS Provider settings');
        }
        this.settings = this.defaultSettings;
        for (const key in settings) {
            if (key in this.settings) {
                this.settings[key] = settings[key];
            } else {
                throw `Invalid setting passed to TTS Provider: ${key}`;
            }
        }
        $('#player2_game_key').val(this.settings.game_key);
        $('#player2_game_key').on('input', () => { this.onSettingsChange(); });

        $('#player2_speed').val(this.settings.speed);
        $('#player2_speed').on('input', () => { this.onSettingsChange(); });
        $('#player2_speed_output').text(this.settings.speed);

        await this.checkReady();
        console.debug('Player2 TTS: Settings loaded');
    }

    async checkReady() {
        await this.fetchTtsVoiceObjects();
    }

    async onRefreshClick() {
        this.voices = [];
        await this.checkReady();
    }

    async getVoice(name) {
        if (this.voices.length === 0) {
            this.voices = await this.fetchTtsVoiceObjects();
        }
        const match = this.voices.find(v => v.name === name || v.voice_id === name);
        if (!match) {
            throw `TTS Voice name ${name} not found`;
        }
        return match;
    }

    async generateTts(text, voiceId) {
        const response = await this.fetchTtsGeneration(text, voiceId);
        return response;
    }

    async fetchTtsVoiceObjects() {
        const response = await fetch('/api/player2/tts/voices', {
            method: 'GET',
            headers: getRequestHeaders(),
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }
        const data = await response.json();
        return (data.voices || []).map(v => ({
            name: v.name,
            voice_id: v.id,
            preview_url: false,
            lang: v.language,
        }));
    }

    async previewTtsVoice(id) {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        const voice = await this.getVoice(id);
        const text = getPreviewString(voice.lang);
        const response = await this.fetchTtsGeneration(text, id);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }
        const audio = await response.blob();
        const url = URL.createObjectURL(audio);
        this.audioElement.src = url;
        this.audioElement.play();
        this.audioElement.onended = () => URL.revokeObjectURL(url);
    }

    async fetchTtsGeneration(text, voiceId) {
        const response = await fetch('/api/player2/tts/speak', {
            method: 'POST',
            headers: getRequestHeaders(),
            body: JSON.stringify({
                text: text,
                voice_ids: [voiceId],
                play_in_app: false,
                speed: this.settings.speed,
                game_key: this.settings.game_key,
            }),
        });
        if (!response.ok) {
            toastr.error(response.statusText, 'TTS Generation Failed');
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }
        return response;
    }

    async fetchTtsFromHistory(history_item_id) {
        return Promise.resolve(history_item_id);
    }
}
