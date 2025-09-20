class PowerUp {
    // Static property to hold the loaded shield power up sprite image
    static getShieldSpriteImage() {
        if (!PowerUp._shieldSpriteImage) {
            PowerUp._shieldSpriteImage = new window.Image();
            PowerUp._shieldSpriteImage.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/bf0a3419-8113-498b-9435-b9adeb49a8d1/library/Chopper_Shield_Power_Up_1756630395547.png";
        }
        return PowerUp._shieldSpriteImage;
    }

    // Static property for Dancing Chopper sprite image
    static getDancingChopperSpriteImage() {
        if (!PowerUp._dancingChopperSpriteImage) {
            PowerUp._dancingChopperSpriteImage = new window.Image();
            // Use a distinct sprite for Dancing Chopper; if you have a custom sprite, use its URL here.
            // For now, let's use a yellow star as a placeholder, or you can replace this with your own sprite.
            PowerUp._dancingChopperSpriteImage.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/0d1c2e7b-2b0b-4b7e-8d8b-1b1a5d8b7b7e/library/Dancing_Chopper_Power_Up_1756640000000.png";
            // If you don't have a sprite, you can use a fallback in render.
        }
        return PowerUp._dancingChopperSpriteImage;
    }

    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.vx = -190;
        this.type = type;
        this.radius = 28; // was 14; doubled for bigger power ups
        this.alive = true;
        this.t = 0;
    }
    update(delta) {
        this.x += this.vx * delta;
        this.t += delta * 1000;
        if (this.x < -30) this.alive = false;
    }
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.t/500);

        if (this.type === "shield") {
            // Draw the new sprite, scaled to fit inside a 56x56 box (diameter = 2*radius)
            const img = PowerUp.getShieldSpriteImage();
            if (img.complete && img.naturalWidth && img.naturalHeight) {
                // Animation: subtle pulsing scale
                const pulse = 1 + 0.08 * Math.sin(this.t / 180);
                // Compute scale to fit inside 2*radius box
                const targetSize = this.radius * 2 * pulse;
                const scale = Math.min(targetSize / img.naturalWidth, targetSize / img.naturalHeight);
                const renderW = img.naturalWidth * scale;
                const renderH = img.naturalHeight * scale;

                // Optional: glow effect behind sprite for visibility
                ctx.save();
                ctx.globalAlpha = 0.36 + 0.13 * Math.sin(this.t / 99);
                ctx.beginPath();
                ctx.arc(0, 0, this.radius + 6, 0, Math.PI * 2);
                ctx.fillStyle = "#4fc3f7";
                ctx.shadowColor = "#0ff";
                ctx.shadowBlur = 24;
                ctx.fill();
                ctx.restore();

                ctx.globalAlpha = 0.93 + 0.07 * Math.sin(this.t / 99);
                ctx.drawImage(
                    img,
                    -renderW / 2,
                    -renderH / 2,
                    renderW,
                    renderH
                );
                ctx.globalAlpha = 1;
            } else {
                // Fallback: original star shape
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    let angle = (i*2*Math.PI/5) - Math.PI/2;
                    let r = (i%2===0) ? this.radius : this.radius*0.45;
                    ctx.lineTo(Math.cos(angle)*r, Math.sin(angle)*r);
                }
                ctx.closePath();
                // Remove blue gradient: fill with white only
                ctx.fillStyle = "#fff";
                ctx.shadowColor = "#0ff";
                ctx.shadowBlur = 20;
                ctx.globalAlpha = 0.88 + 0.11*Math.sin(this.t/99);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
            }
        } else if (this.type === "dancingChopper") {
            // Dancing Chopper: yellow/orange star or sprite
            const img = PowerUp.getDancingChopperSpriteImage();
            if (img.complete && img.naturalWidth && img.naturalHeight) {
                // Animation: pulsing and spinning
                const pulse = 1 + 0.13 * Math.sin(this.t / 120);
                const targetSize = this.radius * 2 * pulse;
                const scale = Math.min(targetSize / img.naturalWidth, targetSize / img.naturalHeight);
                const renderW = img.naturalWidth * scale;
                const renderH = img.naturalHeight * scale;

                // Glow effect behind sprite
                ctx.save();
                ctx.globalAlpha = 0.36 + 0.13 * Math.sin(this.t / 99);
                ctx.beginPath();
                ctx.arc(0, 0, this.radius + 10, 0, Math.PI * 2);
                ctx.fillStyle = "#ffe066";
                ctx.shadowColor = "#fd4";
                ctx.shadowBlur = 28;
                ctx.fill();
                ctx.restore();

                ctx.globalAlpha = 0.93 + 0.07 * Math.sin(this.t / 99);
                ctx.drawImage(
                    img,
                    -renderW / 2,
                    -renderH / 2,
                    renderW,
                    renderH
                );
                ctx.globalAlpha = 1;
            } else {
                // Fallback: draw a yellow/orange star
                ctx.save();
                // Glow
                ctx.globalAlpha = 0.33 + 0.12*Math.sin(this.t/99);
                ctx.beginPath();
                ctx.arc(0, 0, this.radius + 10, 0, Math.PI * 2);
                ctx.fillStyle = "#ffe066";
                ctx.shadowColor = "#fd4";
                ctx.shadowBlur = 28;
                ctx.fill();
                ctx.restore();

                // Star shape
                ctx.beginPath();
                for (let i = 0; i < 7; i++) {
                    let angle = (i*2*Math.PI/7) - Math.PI/2;
                    let r = (i%2===0) ? this.radius : this.radius*0.48;
                    ctx.lineTo(Math.cos(angle)*r, Math.sin(angle)*r);
                }
                ctx.closePath();
                ctx.fillStyle = "#ffe066";
                ctx.shadowColor = "#fd4";
                ctx.shadowBlur = 16;
                ctx.globalAlpha = 0.93 + 0.07*Math.sin(this.t/99);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
            }
        } else {
            // Other powerups (if any in future): fallback to star
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                let angle = (i*2*Math.PI/5) - Math.PI/2;
                let r = (i%2===0) ? this.radius : this.radius*0.45;
                ctx.lineTo(Math.cos(angle)*r, Math.sin(angle)*r);
            }
            ctx.closePath();
            ctx.fillStyle = "#fff";
            ctx.globalAlpha = 0.88 + 0.11*Math.sin(this.t/99);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        ctx.restore();
    }
}
window.PowerUp = PowerUp;