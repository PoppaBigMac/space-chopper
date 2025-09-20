class Explosion {
    constructor(x, y, color="#fff", big=false) {
        this.x = x;
        this.y = y;
        this.t = 0;
        this.duration = big ? 0.82 : 0.49;
        this.big = big;
        this.alive = true;
        this.color = color;
        this.particles = [];
        let parts = big ? 18 : 10;
        for (let i = 0; i < parts; ++i) {
            let angle = Math.random()*Math.PI*2;
            let speed = Math.random()*170 + 70;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle)*speed,
                vy: Math.sin(angle)*speed,
                r: big ? 10 : 6,
                maxr: big ? 18 : 8,
                col: color,
                fade: Math.random()*0.3 + 0.5
            });
        }
    }
    update(delta) {
        this.t += delta;
        if (this.t > this.duration) {
            this.alive = false;
            return;
        }
        for (let p of this.particles) {
            p.x += p.vx * delta;
            p.y += p.vy * delta;
            p.vx *= 0.97;
            p.vy *= 0.97;
            p.r *= 0.97;
        }
    }
    render(ctx) {
        for (let p of this.particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, (1-this.t/this.duration) * p.fade);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            let grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
            grad.addColorStop(0, "#fff");
            grad.addColorStop(0.3, p.col);
            grad.addColorStop(1, "#0000");
            ctx.fillStyle = grad;
            ctx.shadowColor = p.col;
            ctx.shadowBlur = 24;
            ctx.fill();
            ctx.restore();
        }
    }
}
window.Explosion = Explosion;