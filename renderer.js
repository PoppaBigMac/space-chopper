class Renderer {
    constructor(ctx, game) {
        this.ctx = ctx;
        this.game = game;
    }
    render() {
        const ctx = this.ctx;
        ctx.clearRect(0,0,1040,480);
        // BG
        this.game.background.render(ctx);

        // Player bullets
        for (let b of this.game.playerBullets) b.render(ctx);
        // Enemy bullets
        for (let b of this.game.enemyBullets) b.render(ctx);
        // Enemies
        for (let e of this.game.enemies) e.render(ctx);
        // Power-ups
        for (let p of this.game.powerUps) p.render(ctx);
        // Explosions
        for (let ex of this.game.explosions) ex.render(ctx);

        // Player
        if (this.game.player && this.game.player.alive) {
            // Pass dancingChopper: true if powerup is active
            this.game.player.render(ctx, {
                dancingChopper: !!this.game.dancingChopperActive
            });
        }

        // HUD: Draw score and lives inside the canvas, top left and top right
        if (
            this.game.stateManager &&
            (this.game.stateManager.is('playing') || this.game.stateManager.is('paused') || this.game.stateManager.is('levelup'))
        ) {
            ctx.save();
            ctx.font = "bold 20px 'Press Start 2P', 'VT323', 'Monaco', monospace";
            ctx.textBaseline = "top";
            // Score (top left)
            ctx.shadowColor = "#000";
            ctx.shadowBlur = 4;
            ctx.fillStyle = "#ffe066";
            ctx.fillText(
                "SCORE: " + (this.game.scoreManager ? this.game.scoreManager.score : "0"),
                22, 16
            );
            // Lives (top right)
            ctx.fillStyle = "#fd4";
            let livesText = "LIVES: " + (this.game.player ? this.game.player.lives : "0");
            let textWidth = ctx.measureText(livesText).width;
            ctx.fillText(
                livesText,
                1040 - textWidth - 22,
                16
            );
            // --- LEVEL INDICATOR (top center) ---
            ctx.fillStyle = "#4fc3f7";
            ctx.font = "bold 22px 'Press Start 2P', 'VT323', 'Monaco', monospace";
            let levelText = "LEVEL: " + (this.game.level || 1);
            let levelWidth = ctx.measureText(levelText).width;
            ctx.fillText(
                levelText,
                1040/2 - levelWidth/2,
                16
            );
            // --- LEVEL TIMER BAR (below level) ---
            if (typeof this.game.levelTimer === "number" && typeof this.game.levelDuration === "number") {
                let barW = 340, barH = 12;
                let barX = 1040/2 - barW/2, barY = 44;
                let pct = Math.max(0, Math.min(1, this.game.levelTimer/this.game.levelDuration));
                // Background
                ctx.save();
                ctx.globalAlpha = 0.18;
                ctx.fillStyle = "#fff";
                ctx.fillRect(barX, barY, barW, barH);
                ctx.globalAlpha = 1;
                // Foreground
                ctx.fillStyle = "#4fc3f7";
                ctx.fillRect(barX, barY, barW*pct, barH);
                ctx.strokeStyle = "#70e8ff";
                ctx.lineWidth = 2;
                ctx.strokeRect(barX, barY, barW, barH);
                ctx.restore();
            }
            ctx.shadowBlur = 0;
            ctx.restore();
        }
    }
}
window.Renderer = Renderer;