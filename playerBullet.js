class PlayerBullet {
    // Static property to hold the loaded bullet sprite image
    static getSpriteImage() {
        if (!PlayerBullet._spriteImage) {
            PlayerBullet._spriteImage = new window.Image();
            PlayerBullet._spriteImage.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/bf0a3419-8113-498b-9435-b9adeb49a8d1/library/Cotton_Candy_Bullet_1756629764065.png";
        }
        return PlayerBullet._spriteImage;
    }

    constructor(x, y, vy=0, power=1) {
        this.x = x;
        this.y = y;
        this.vx = 540;
        this.vy = vy;
        this.radius = 6;
        this.color = "#fff";
        this.power = power;
        this.alive = true;
    }

    update(delta) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;
        if (this.x > 1060 || this.y < -20 || this.y > 500) this.alive = false;
    }

    render(ctx) {
        const img = PlayerBullet.getSpriteImage();
        // Only draw sprite if loaded, otherwise fallback to old effect
        if (img.complete && img.naturalWidth && img.naturalHeight) {
            ctx.save();
            // Center the sprite on (this.x, this.y)
            // Scale the sprite so it fits inside a 12x12 box (diameter of radius 6 bullet)
            const targetSize = this.radius * 2;
            const scale = Math.min(targetSize / img.naturalWidth, targetSize / img.naturalHeight);
            const renderW = img.naturalWidth * scale;
            const renderH = img.naturalHeight * scale;

            // Optional: Add a subtle glow behind the sprite for effect
            ctx.save();
            ctx.globalAlpha = 0.32;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
            ctx.fillStyle = "#fff";
            ctx.shadowColor = "#9ff";
            ctx.shadowBlur = 16;
            ctx.fill();
            ctx.restore();

            ctx.globalAlpha = 1.0;
            ctx.drawImage(
                img,
                this.x - renderW / 2,
                this.y - renderH / 2,
                renderW,
                renderH
            );
            ctx.restore();
        } else {
            // Fallback: draw original effect (radial gradient circle)
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            grad.addColorStop(0, "#fff");
            grad.addColorStop(0.22, "#fff");
            grad.addColorStop(0.45, "#0ff");
            grad.addColorStop(1, "#23c6ff00");
            ctx.shadowColor = "#9ff";
            ctx.shadowBlur = 14;
            ctx.fillStyle = grad;
            ctx.globalAlpha = 0.88 + 0.12*Math.sin(this.x);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
            ctx.restore();
        }
    }
}
window.PlayerBullet = PlayerBullet;