class Enemy {
    /**
     * Enemy types:
     * 0 = kuromarimo (blue spiky ball)
     * 1 = saucer
     * 2 = crab
     * 
     * "kuromarimo enemies" refers to type 0.
     */

    // Static property to hold the loaded kuromarimo idle sprite image
    static getKuromarimoSpriteImage() {
        if (!Enemy._kuromarimoSpriteImage) {
            Enemy._kuromarimoSpriteImage = new window.Image();
            // CHANGED: Updated sprite URL as requested
            Enemy._kuromarimoSpriteImage.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/bf0a3419-8113-498b-9435-b9adeb49a8d1/library/Kukomarimo_Idle_Updated_1756631697534.png";
        }
        return Enemy._kuromarimoSpriteImage;
    }

    // Static property to hold the loaded kuromarimo shooting sprite image
    static getKuromarimoShootingSpriteImage() {
        if (!Enemy._kuromarimoShootingSpriteImage) {
            Enemy._kuromarimoShootingSpriteImage = new window.Image();
            Enemy._kuromarimoShootingSpriteImage.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/bf0a3419-8113-498b-9435-b9adeb49a8d1/library/kuromarimo_shooting_1756631865012.png";
        }
        return Enemy._kuromarimoShootingSpriteImage;
    }

    constructor(type, x, y, speed, hp, color) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.hp = hp;
        // Make kuromarimo (type 0) enemies even larger
        if (type === 0) {
            this.radius = 60; // was 38, now much larger
        } else {
            this.radius = 20 + 7*type;
        }
        this.alive = true;
        this.shootCooldown = Math.random()*1800 + 1100;
        this.color = color;
        this.explodeTimer = 0;

        // Label enemy type as string for future extensibility
        if (type === 0) {
            this.enemyType = "kuromarimo";
            // Rectangle dimensions for kuromarimo
            this.rectWidth = this.radius * 2;
            this.rectHeight = this.radius * 2;
            // Track shooting state for sprite
            this._shootSpriteTimer = 0;
            this._shootSpriteDuration = 120; // ms, show shooting sprite for this long after shooting
        } else if (type === 1) {
            this.enemyType = "saucer";
        } else if (type === 2) {
            this.enemyType = "crab";
        } else {
            this.enemyType = "unknown";
        }
    }
    // Pass level to update for shooting logic
    update(delta, level) {
        this.x -= this.speed * delta;
        if (this.type === 2) {
            // Sinusoidal movement
            this.y += Math.sin(Date.now()/300 + this.x/40) * 0.6;
        }
        if (this.x < -60) this.alive = false;
        if (this.shootCooldown > 0) this.shootCooldown -= delta * 1000;

        // Kuromarimo shooting sprite timer
        if (this.type === 0 && this._shootSpriteTimer > 0) {
            this._shootSpriteTimer -= delta * 1000;
            if (this._shootSpriteTimer < 0) this._shootSpriteTimer = 0;
        }
    }
    canShoot() {
        return this.shootCooldown <= 0;
    }
    // Pass level to shoot for scaling shooting frequency
    shoot(level) {
        if (this.type === 0 && typeof level === "number") {
            // Kuromarimo: shoot faster as level increases
            // At level 1: cooldown 1100-1400ms, at level 10: 600-900ms
            let minCD = Math.max(400, 1100 - (level-1)*60);
            let maxCD = Math.max(600, 1400 - (level-1)*50);
            this.shootCooldown = Math.random()*(maxCD-minCD) + minCD;
        } else {
            this.shootCooldown = Math.random()*1400 + 1100;
        }
        // If kuromarimo, set shooting sprite timer
        if (this.type === 0) {
            this._shootSpriteTimer = this._shootSpriteDuration;
        }
    }
    damage(d) {
        this.hp -= d;
        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
            return true;
        }
        return false;
    }
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        // Main body
        ctx.save();
        ctx.rotate(Math.sin(Date.now()/200 + this.x*0.04)*0.03);

        if (this.type === 0) {
            // Type 0: kuromarimo enemy - render as rectangle with sprite

            // Rectangle dimensions (centered at 0,0)
            const width = this.rectWidth;
            const height = this.rectHeight;

            // --- CHANGED: Use shooting sprite if recently shot ---
            let img;
            if (this._shootSpriteTimer > 0) {
                img = Enemy.getKuromarimoShootingSpriteImage();
            } else {
                img = Enemy.getKuromarimoSpriteImage();
            }

            // Draw the sprite, scaled to fit the rectangle
            if (img.complete && img.naturalWidth && img.naturalHeight) {
                // Compute scale to fit inside width x height, preserving aspect ratio
                const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
                const renderW = img.naturalWidth * scale;
                const renderH = img.naturalHeight * scale;

                // Removed fill style and shadow color for kuromarimo
                ctx.globalAlpha = 1.0;
                ctx.drawImage(
                    img,
                    -renderW/2,
                    -renderH/2,
                    renderW,
                    renderH
                );
            } else {
                // Fallback: draw a blue rectangle, but remove fill style and shadow color
                ctx.save();
                ctx.beginPath();
                ctx.rect(-width/2, -height/2, width, height);
                ctx.closePath();
                // No fillStyle, no shadow
                ctx.strokeStyle = "#2be";
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.restore();
            }
        } else if (this.type === 1) {
            // Type 1: Saucer
            ctx.ellipse(0,0,this.radius+7,this.radius-3,0,0,2*Math.PI);
            let grad = ctx.createLinearGradient(-this.radius, -8, this.radius, 8);
            grad.addColorStop(0, "#ffd");
            grad.addColorStop(0.4, "#aef");
            grad.addColorStop(1, "#27d");
            ctx.fillStyle = grad;
            ctx.shadowColor = "#7efcff";
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
            // Dome
            ctx.beginPath();
            ctx.ellipse(0,-7,this.radius/2.1,8,0,0,2*Math.PI);
            ctx.closePath();
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = "#fff8";
            ctx.fill();
            ctx.globalAlpha = 1.0;
        } else if (this.type === 2) {
            // Type 2: Crab
            ctx.beginPath();
            ctx.ellipse(0,0,this.radius-5,this.radius,0,0,2*Math.PI);
            ctx.closePath();
            let grad = ctx.createLinearGradient(0,-this.radius,0,this.radius);
            grad.addColorStop(0, "#fff");
            grad.addColorStop(0.5, "#f53");
            grad.addColorStop(1, "#920");
            ctx.fillStyle = grad;
            ctx.shadowColor = "#f53";
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
            // Legs
            ctx.strokeStyle = "#faa";
            ctx.lineWidth = 4;
            for(let i=0;i<4;++i){
                let angle = Math.PI/3 + i*0.3;
                ctx.beginPath();
                ctx.moveTo(-this.radius+6, Math.sin(angle)*this.radius*0.6);
                ctx.lineTo(-this.radius-8, Math.sin(angle)*this.radius*0.9);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(this.radius-6, Math.sin(angle)*this.radius*0.6);
                ctx.lineTo(this.radius+8, Math.sin(angle)*this.radius*0.9);
                ctx.stroke();
            }
        }
        ctx.restore();

        // Eyes for all
        ctx.save();
        ctx.translate(5, -8);
        ctx.beginPath();
        ctx.arc(0,0,3,0,2*Math.PI);
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(7,2,2,0,2*Math.PI);
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
        ctx.restore();
    }
}
window.Enemy = Enemy;