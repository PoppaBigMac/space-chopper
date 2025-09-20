class InputHandler {
    constructor() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.shoot = false;
        this.pause = false;
        this.keys = {};
        this.active = true;
        this._bindEvents();
    }
    _bindEvents() {
        window.addEventListener('keydown', e => {
            if (!this.active) return;
            this.keys[e.code] = true;
            if (e.code === "ArrowUp" || e.code === "KeyW") this.up = true;
            if (e.code === "ArrowDown" || e.code === "KeyS") this.down = true;
            if (e.code === "ArrowLeft" || e.code === "KeyA") this.left = true;
            if (e.code === "ArrowRight" || e.code === "KeyD") this.right = true;
            if (e.code === "Space") this.shoot = true;
            if (e.code === "KeyP") this.pause = true;
        });
        window.addEventListener('keyup', e => {
            this.keys[e.code] = false;
            if (e.code === "ArrowUp" || e.code === "KeyW") this.up = false;
            if (e.code === "ArrowDown" || e.code === "KeyS") this.down = false;
            if (e.code === "ArrowLeft" || e.code === "KeyA") this.left = false;
            if (e.code === "ArrowRight" || e.code === "KeyD") this.right = false;
            if (e.code === "Space") this.shoot = false;
            if (e.code === "KeyP") this.pause = false;
        });
    }
    reset() {
        this.left = this.right = this.up = this.down = this.shoot = this.pause = false;
        this.keys = {};
    }
    setActive(active) {
        this.active = active;
        if (!active) this.reset();
    }
}
window.InputHandler = InputHandler;