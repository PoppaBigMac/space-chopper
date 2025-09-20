class Projectile {
    constructor(x, y, dx, dy, owner) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = 6;
        this.owner = owner; // 'player' or 'enemy'
        this.alive = true;
        this.life = 0;
    }
    update(delta) {
        this.x += this.dx;
        this.y += this.dy;
        this.life += delta;
        // Offscreen?
        if (
            this.x < -24 || this.x > 824 ||
            this.y < -24 || this.y > 624
        ) {
            this.alive = false;
        }
    }
    render(ctx) {
        ctx.save();
        // Glow
        ctx.shadowColor = (this.owner === 'player') ? 'rgba(240,255,160,0.68)' : 'rgba(255,60,100,0.72)';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius+2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = (this.owner === 'player') ? 'rgba(250,255,180,0.15)' : 'rgba(255,80,120,0.13)';
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = (this.owner === 'player') ? 'hsl(54, 100%, 69%)' : 'hsl(345, 100%, 64%)';
        ctx.globalAlpha = 0.95;
        ctx.fill();
        ctx.restore();
    }
}
window.Projectile = Projectile;