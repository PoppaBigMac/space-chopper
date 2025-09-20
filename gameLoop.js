class GameLoop {
    constructor(game, renderer) {
        this.game = game;
        this.renderer = renderer;
        this.lastTime = 0;
        this.running = false;
        this.boundLoop = this.loop.bind(this);
    }
    start() {
        this.lastTime = performance.now();
        this.running = true;
        requestAnimationFrame(this.boundLoop);
    }
    stop() {
        this.running = false;
    }
    loop(now) {
        if (!this.running) return;
        let delta = Math.min(0.04, (now - this.lastTime)/1000);
        this.lastTime = now;
        this.game.update(delta);
        this.renderer.render();
        requestAnimationFrame(this.boundLoop);
    }
}
window.GameLoop = GameLoop;