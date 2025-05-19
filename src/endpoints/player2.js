import fetch from 'node-fetch';
import { Router } from 'express';

export const router = Router();

const BASE_URL = 'http://localhost:4315/v1';

function buildHeaders(gameKey) {
    return {
        'Content-Type': 'application/json',
        'player2-game-key': 'SillyTavern',
    };
}

router.get('/tts/voices', async (_, res) => {
    try {
        const result = await fetch(`${BASE_URL}/tts/voices`);
        if (!result.ok) {
            console.warn('Player2 TTS voices request failed', result.status, result.statusText);
            return res.sendStatus(500);
        }
        const data = await result.json();
        return res.json(data);
    } catch (error) {
        console.error('Player2 TTS voices request failed', error);
        return res.sendStatus(500);
    }
});

router.post('/tts/speak', async (req, res) => {
    try {
        const result = await fetch(`${BASE_URL}/tts/speak`, {
            method: 'POST',
            headers: buildHeaders(),
            body: JSON.stringify({
                text: req.body.text,
                voice_ids: req.body.voice_ids,
                play_in_app: false,
                speed: req.body.speed ?? 1,
                voice_gender: req.body.voice_gender,
                voice_language: req.body.voice_language,
            }),
        });
        if (!result.ok) {
            console.warn('Player2 TTS generation failed', result.status, result.statusText);
            return res.sendStatus(500);
        }
        const data = await result.json();
        const audio = Buffer.from(data.data, 'base64');
        res.set('Content-Type', 'audio/mpeg');
        return res.send(audio);
    } catch (error) {
        console.error('Player2 TTS generation failed', error);
        return res.sendStatus(500);
    }
});

router.post('/tts/stop', async (req, res) => {
    try {
        const result = await fetch(`${BASE_URL}/tts/stop`, {
            method: 'POST',
            headers: buildHeaders(),
        });
        if (!result.ok) {
            console.warn('Player2 TTS stop failed', result.status, result.statusText);
            return res.sendStatus(500);
        }
        const data = await result.json();
        return res.json(data);
    } catch (error) {
        console.error('Player2 TTS stop failed', error);
        return res.sendStatus(500);
    }
});

router.get('/tts/volume', async (_, res) => {
    try {
        const result = await fetch(`${BASE_URL}/tts/volume`);
        if (!result.ok) {
            return res.sendStatus(500);
        }
        const data = await result.json();
        return res.json(data);
    } catch (error) {
        console.error('Player2 TTS volume get failed', error);
        return res.sendStatus(500);
    }
});

router.post('/tts/volume', async (req, res) => {
    try {
        const result = await fetch(`${BASE_URL}/tts/volume`, {
            method: 'POST',
            headers: buildHeaders(),
            body: JSON.stringify({ volume: req.body.volume }),
        });
        if (!result.ok) {
            return res.sendStatus(500);
        }
        const data = await result.json();
        return res.json(data);
    } catch (error) {
        console.error('Player2 TTS volume set failed', error);
        return res.sendStatus(500);
    }
});

router.post('/stt/start', async (req, res) => {
    try {
        const result = await fetch(`${BASE_URL}/stt/start`, {
            method: 'POST',
            headers: buildHeaders(),
            body: JSON.stringify({ timeout: req.body.timeout }),
        });
        if (!result.ok) {
            console.warn('Player2 STT start failed', result.status, result.statusText);
            return res.sendStatus(500);
        }
        const data = await result.json();
        return res.json(data);
    } catch (error) {
        console.error('Player2 STT start failed', error);
        return res.sendStatus(500);
    }
});

router.post('/stt/stop', async (req, res) => {
    try {
        const result = await fetch(`${BASE_URL}/stt/stop`, {
            method: 'POST',
            headers: buildHeaders(),
        });
        if (!result.ok) {
            console.warn('Player2 STT stop failed', result.status, result.statusText);
            return res.sendStatus(500);
        }
        const data = await result.json();
        return res.json(data);
    } catch (error) {
        console.error('Player2 STT stop failed', error);
        return res.sendStatus(500);
    }
});

router.get('/stt/languages', async (_, res) => {
    try {
        const result = await fetch(`${BASE_URL}/stt/languages`);
        if (!result.ok) {
            return res.sendStatus(500);
        }
        const data = await result.json();
        return res.json(data);
    } catch (error) {
        console.error('Player2 STT languages failed', error);
        return res.sendStatus(500);
    }
});

router.get('/stt/language', async (_, res) => {
    try {
        const result = await fetch(`${BASE_URL}/stt/language`);
        if (!result.ok) {
            return res.sendStatus(500);
        }
        const data = await result.json();
        return res.json(data);
    } catch (error) {
        console.error('Player2 STT language failed', error);
        return res.sendStatus(500);
    }
});

router.post('/stt/language', async (req, res) => {
    try {
        const result = await fetch(`${BASE_URL}/stt/language`, {
            method: 'POST',
            headers: buildHeaders(),
            body: JSON.stringify({ code: req.body.code }),
        });
        if (!result.ok) {
            return res.sendStatus(500);
        }
        const data = await result.json();
        return res.json(data);
    } catch (error) {
        console.error('Player2 STT set language failed', error);
        return res.sendStatus(500);
    }
});

