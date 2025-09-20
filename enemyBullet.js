class EnemyBullet {
    constructor(x, y, vx = -340, vy = 0, ownerType = null) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = 7;
        this.alive = true;
        this.ownerType = ownerType; // NEW: track which enemy type fired this bullet
    }
    update(delta) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;
        if (this.x < -30 || this.y < -30 || this.y > 510) this.alive = false;
    }
    render(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);

        // --- MODIFIED: Kuromarimo (type 0) enemy bullets are black ---
        if (this.ownerType === 0) {
            // Black bullet with subtle dark glow
            let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            grad.addColorStop(0, "#222");
            grad.addColorStop(0.3, "#000");
            grad.addColorStop(1, "#00000000");
            ctx.shadowColor = "#000";
            ctx.shadowBlur = 13;
            ctx.fillStyle = grad;
            ctx.globalAlpha = 0.93;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        } else {
            // Default: yellow bullet
            let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            grad.addColorStop(0, "#ff8");
            grad.addColorStop(0.22, "#ff0");
            grad.addColorStop(0.45, "#fc0");
            grad.addColorStop(1, "#ff800000");
            ctx.shadowColor = "#ff0";
            ctx.shadowBlur = 12;
            ctx.fillStyle = grad;
            ctx.globalAlpha = 0.88 + 0.12*Math.sin(this.x);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }
        ctx.restore();
    }
}
window.EnemyBullet = EnemyBullet;