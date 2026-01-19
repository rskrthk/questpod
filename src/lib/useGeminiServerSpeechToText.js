import { useCallback, useEffect, useRef, useState } from 'react';

// Simple WAV encoder for Float32 PCM to 16-bit PCM WAV
function encodeWAV(samples, sampleRate) {
  const bufferLength = samples.length * 2; // 16-bit
  const buffer = new ArrayBuffer(44 + bufferLength);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + bufferLength, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // size of fmt chunk
  view.setUint16(20, 1, true); // audio format (PCM)
  view.setUint16(22, 1, true); // number of channels (mono)
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate (sampleRate * blockAlign)
  view.setUint16(32, 2, true); // block align (channels * bytes per sample)
  view.setUint16(34, 16, true); // bits per sample

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, bufferLength, true);

  // write PCM samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    // clamp to [-1,1]
    let s = Math.max(-1, Math.min(1, samples[i]));
    // scale to 16-bit signed integer
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, str) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

export default function useGeminiServerSpeechToText({ autoStart = false } = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const audioContextRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const pcmBufferRef = useRef([]);
  const closingRef = useRef(false);

  const startSpeechToText = useCallback(async () => {
    setError(null);
    setResults([]);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const bufferSize = 4096;
      const processor = audioContext.createScriptProcessor(bufferSize, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // copy samples to avoid keeping references
        pcmBufferRef.current.push(new Float32Array(inputData));
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      setError(err?.message || 'Failed to start recording');
      setIsRecording(false);
    }
  }, []);

  const stopSpeechToText = useCallback(async () => {
    if (closingRef.current) return; // prevent concurrent closes
    closingRef.current = true;
    try {
      setIsRecording(false);

      // capture sample rate before closing context
      const sampleRate = audioContextRef.current?.sampleRate || 48000;

      // stop nodes
      try { if (processorRef.current) { processorRef.current.disconnect(); processorRef.current = null; } } catch {}
      try { if (sourceRef.current) { sourceRef.current.disconnect(); sourceRef.current = null; } } catch {}

      // stop tracks
      if (streamRef.current) {
        try { streamRef.current.getTracks().forEach((t) => t.stop()); } catch {}
        streamRef.current = null;
      }

      // close audio context safely
      try {
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          await audioContextRef.current.close();
        }
      } catch {}
      audioContextRef.current = null;

      // flatten PCM buffers
      const segments = pcmBufferRef.current;
      pcmBufferRef.current = [];
      if (!segments || segments.length === 0) {
        return;
      }
      const totalLength = segments.reduce((sum, arr) => sum + arr.length, 0);
      const pcm = new Float32Array(totalLength);
      let offset = 0;
      for (const seg of segments) {
        pcm.set(seg, offset);
        offset += seg.length;
      }

      const wavBlob = encodeWAV(pcm, sampleRate);

      // base64 encode on client
      const base64Audio = await blobToBase64(wavBlob);

      const resp = await fetch('/api/gemini-transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mimeType: 'audio/wav', base64Audio }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Transcription failed (${resp.status}): ${text}`);
      }

      const data = await resp.json();
      const transcript = data?.transcript || '';

      if (transcript) {
        setResults((prev) => [...prev, { transcript }]);
      }
    } catch (err) {
      console.error('Failed to stop recording / transcribe', err);
      setError(err?.message || 'Transcription error');
    } finally {
      closingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (autoStart) {
      startSpeechToText();
      return () => {
        stopSpeechToText();
      };
    }
  }, [autoStart, startSpeechToText, stopSpeechToText]);

  return {
    isRecording,
    results,
    setResults,
    error,
    startSpeechToText,
    stopSpeechToText,
  };
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      const base64 = String(dataUrl).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}