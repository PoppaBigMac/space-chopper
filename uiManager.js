class UIManager {
    constructor(game) {
        this.game = game;
        this.overlay = document.getElementById('ui-overlay');
        this.panel = null;
        this.countdownPanel = null;
        // Remove HUD overlay, since we now draw HUD in canvas
        // this._renderHUD();
    }
    _clearPanel() {
        if (this.panel) {
            this.panel.remove();
            this.panel = null;
        }
    }
    updateHUD(score, lives) {
        // No-op: HUD is now drawn in canvas
    }

    // Helper to get canvas position relative to the document
    _canvasRect() {
        const canvas = document.getElementById('game-canvas');
        return canvas.getBoundingClientRect();
    }

    // Helper to position the panel absolutely over the canvas
    _attachPanel(panel) {
        // Remove any existing panel
        this._clearPanel();

        // Attach to game-container so it appears above the canvas, but within its bounds
        const container = document.getElementById('game-container');

        // Style the panel to be absolutely positioned inside the container
        panel.style.position = 'absolute';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.pointerEvents = 'auto';
        panel.style.zIndex = '50';

        container.appendChild(panel);
        this.panel = panel;
    }

    showMenu(onStart) {
        let panel = document.createElement('div');
        panel.className = 'ui-panel';
        panel.innerHTML = `
            <h1>Space Chopper:<br>A Cotton Candy Odyssey</h1>
            <div class="score" style="font-size:1.1rem;line-height:1.7">
                <b>HOW TO PLAY</b><br>
                <span style="color:#ffe066">ARROW KEYS</span> or WASD to move<br>
                <span style="color:#ffe066">SPACE</span> to shoot<br>
            </div>
            <button id="start-btn" tabindex="0">START GAME</button>
        `;
        panel.querySelector('#start-btn').onclick = () => {
            this._clearPanel();
            if (onStart) onStart();
        };
        this._attachPanel(panel);
    }

    showGameOver(score, onRestart) {
        let panel = document.createElement('div');
        panel.className = 'ui-panel';
        panel.innerHTML = `
            <h1>GAME OVER</h1>
            <div class="score">FINAL SCORE: <b>${score}</b></div>
            <button id="restart-btn" tabindex="0">RESTART</button>
        `;
        panel.querySelector('#restart-btn').onclick = () => {
            this._clearPanel();
            if (onRestart) onRestart();
        };
        this._attachPanel(panel);
    }

    showPause(onResume) {
        let panel = document.createElement('div');
        panel.className = 'ui-panel';
        panel.innerHTML = `
            <h1>PAUSED</h1>
            <button id="resume-btn" tabindex="0">RESUME</button>
        `;
        panel.querySelector('#resume-btn').onclick = () => {
            this._clearPanel();
            if (onResume) onResume();
        };
        this._attachPanel(panel);
    }

    showCountdown(seconds) {
        this.clearCountdown();
        let panel = document.createElement('div');
        panel.className = 'ui-panel';
        panel.style.background = "rgba(12, 18, 44, 0.85)";
        panel.style.border = "2px solid #4fc3f7";
        panel.style.minWidth = "220px";
        panel.style.padding = "32px 32px";
        panel.style.fontSize = "2.6rem";
        panel.style.color = "#ffe066";
        panel.style.letterSpacing = "2px";
        panel.style.textAlign = "center";
        panel.innerHTML = `
            <div id="countdown-number" style="font-size:4.2rem; font-weight:bold; margin-bottom:12px;">${seconds}</div>
            <div style="font-size:1.2rem; color:#fff; letter-spacing:1px;">GET READY!</div>
        `;
        // Attach as overlay above canvas
        const container = document.getElementById('game-container');
        panel.style.zIndex = '60';
        container.appendChild(panel);
        this.countdownPanel = panel;
    }

    updateCountdown(number) {
        if (this.countdownPanel) {
            let el = this.countdownPanel.querySelector('#countdown-number');
            if (el) el.textContent = number;
        }
    }

    clearCountdown() {
        if (this.countdownPanel) {
            this.countdownPanel.remove();
            this.countdownPanel = null;
        }
    }
}
window.UIManager = UIManager;