class AudioManager {
    constructor() {
        this.sounds = {};
        this.muted = false;
        this._init();
    }
    _init() {
        // Procedural SFX using Web Audio API
        this.ctx = null;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) { }
    }
    playShoot() {
        if (this.muted || !this.ctx) return;
        let o = this.ctx.createOscillator();
        let g = this.ctx.createGain();
        o.type = "triangle";
        o.frequency.value = 530 + Math.random()*40;
        g.gain.value = 0.15;
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start();
        o.frequency.linearRampToValueAtTime(360, this.ctx.currentTime+0.10);
        g.gain.linearRampToValueAtTime(0, this.ctx.currentTime+0.13);
        o.stop(this.ctx.currentTime+0.14);
    }
    playExplosion() {
        if (this.muted || !this.ctx) return;
        let dur = 0.22+Math.random()*0.1;
        let buffer = this.ctx.createBuffer(1, this.ctx.sampleRate*dur, this.ctx.sampleRate);
        let output = buffer.getChannelData(0);
        for (let i = 0; i < output.length; i++) {
            let t = i/output.length;
            output[i] = (Math.random()*2-1)*Math.pow(1-t,2)*0.55;
        }
        let src = this.ctx.createBufferSource();
        src.buffer = buffer;
        let gain = this.ctx.createGain();
        gain.gain.value = 0.19;
        src.connect(gain).connect(this.ctx.destination);
        src.start();
    }
    playPowerUp() {
        if (this.muted || !this.ctx) return;
        let o = this.ctx.createOscillator();
        let g = this.ctx.createGain();
        o.type = "square";
        o.frequency.value = 220;
        g.gain.value = 0.13;
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start();
        o.frequency.linearRampToValueAtTime(660, this.ctx.currentTime+0.18);
        g.gain.linearRampToValueAtTime(0, this.ctx.currentTime+0.22);
        o.stop(this.ctx.currentTime+0.23);
    }
    playGameOver() {
        if (this.muted || !this.ctx) return;
        let o = this.ctx.createOscillator();
        let g = this.ctx.createGain();
        o.type = "sawtooth";
        o.frequency.value = 180;
        g.gain.value = 0.13;
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start();
        o.frequency.linearRampToValueAtTime(60, this.ctx.currentTime+0.24);
        g.gain.linearRampToValueAtTime(0, this.ctx.currentTime+0.33);
        o.stop(this.ctx.currentTime+0.34);
    }
    toggleMute() {
        this.muted = !this.muted;
    }
}
window.AudioManager = AudioManager;