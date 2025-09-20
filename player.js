class Player {
    // Static property to hold the loaded sprite images
    static getSpriteImage() {
        if (!Player._spriteImage) {
            Player._spriteImage = new window.Image();
            Player._spriteImage.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/bf0a3419-8113-498b-9435-b9adeb49a8d1/library/Idle_Chopper_1756622463677.png";
        }
        return Player._spriteImage;
    }

    static getDamagedSpriteImage() {
        if (!Player._damagedSpriteImage) {
            Player._damagedSpriteImage = new window.Image();
            Player._damagedSpriteImage.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/bf0a3419-8113-498b-9435-b9adeb49a8d1/library/Chopper_Damaged_1756624825685.png";
        }
        return Player._damagedSpriteImage;
    }

    static getShootingSpriteImage() {
        if (!Player._shootingSpriteImage) {
            Player._shootingSpriteImage = new window.Image();
            // Changed to requested sprite URL
            Player._shootingSpriteImage.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/bf0a3419-8113-498b-9435-b9adeb49a8d1/library/Chopper_Shooting_1756625564370.png";
        }
        return Player._shootingSpriteImage;
    }

    // New: Shielded sprite
    static getShieldedSpriteImage() {
        if (!Player._shieldedSpriteImage) {
            Player._shieldedSpriteImage = new window.Image();
            Player._shieldedSpriteImage.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/bf0a3419-8113-498b-9435-b9adeb49a8d1/library/Chopper_Guard_Point_1756626167782.png";
        }
        return Player._shieldedSpriteImage;
    }

    // New: Shielded + Shooting sprite
    static getShieldedShootingSpriteImage() {
        if (!Player._shieldedShootingSpriteImage) {
            Player._shieldedShootingSpriteImage = new window.Image();
            Player._shieldedShootingSpriteImage.src = "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/bf0a3419-8113-498b-9435-b9adeb49a8d1/library/Chopper_Shooting_while_Shielded_1756628252821.png";
        }
        return Player._shieldedShootingSpriteImage;
    }

    // --- BEGIN: Dancing Chopper Animation Frames ---
    static getDancingChopperFrames() {
        if (!Player._dancingChopperFrames) {
            // List of frame URLs (all 5, including both frame_1 variants)
            const urls = [
                "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/bf0a3419-8113-498b-9435-b9adeb49a8d1/library/frames/Dancing%20Chopper%20Animation_frame_1.png",
                "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/bf0a3419-8113-498b-9435-b9adeb49a8d1/library/frames/Dancing_Chopper_Animation_frame_1.png",
                "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/bf0a3419-8113-498b-9435-b9adeb49a8d1/library/frames/Dancing_Chopper_Animation_frame_2.png",
                "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/bf0a3419-8113-498b-9435-b9adeb49a8d1/library/frames/Dancing_Chopper_Animation_frame_3.png",
                "https://dcnmwoxzefwqmvvkpqap.supabase.co/storage/v1/object/public/sprite-studio-exports/bf0a3419-8113-498b-9435-b9adeb49a8d1/library/frames/Dancing_Chopper_Animation_frame_4.png"
            ];
            Player._dancingChopperFrames = urls.map(url => {
                const img = new window.Image();
                img.src = url;
                return img;
            });
        }
        return Player._dancingChopperFrames;
    }
    // --- END: Dancing Chopper Animation Frames ---

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 60; // was 44, now even bigger
        this.width = 152;  // was 112, now even bigger
        this.height = 92; // was 68, now even bigger
        this.speed = 278;
        this.color = "#5df6ff";
        this.lives = 3;
        this.maxLives = 5;
        this.invulnerable = false;
        this.invulnTimer = 0;
        this.invulnDuration = 1500;
        this.shootCooldown = 0;
        this.shootDelay = 190;
        this.power = 1;
        this.powerTimer = 0;
        this.powerDuration = 7000;
        this.alive = true;
        this.flash = false;

        // For tracking shooting state for sprite
        this._wasShooting = false;
        this._shootSpriteTimer = 0;
        this._shootSpriteDuration = 110; // ms, show shooting sprite for this long after shooting

        // Shield power up
        this.shielded = false;
        this.shieldTimer = 0;
        this.shieldDuration = 7000; // ms

        // --- Dancing Chopper Animation ---
        this._dancingChopperAnimTime = 0; // ms
    }

    update(input, delta) {
        if (!this.alive) return;
        let moveX = 0, moveY = 0;
        if (input.left) moveY -= 1;
        if (input.right) moveY += 1;
        if (input.up) moveX += 1;
        if (input.down) moveX -= 1;
        // Note: the ship is rotated so up/down is X, left/right is Y
        // But in this game, up/down is y, left/right is x (normal orientation)
        if (input.up) this.y -= this.speed * delta;
        if (input.down) this.y += this.speed * delta;
        if (input.left) this.x -= this.speed * delta;
        if (input.right) this.x += this.speed * delta;
        // Clamp inside bounds
        this.x = Math.max(0, Math.min(1040 - this.width, this.x));
        this.y = Math.max(0, Math.min(480 - this.height, this.y));

        if (this.invulnerable) {
            this.invulnTimer -= delta * 1000;
            if (this.invulnTimer <= 0) {
                this.invulnerable = false;
                this.flash = false;
            } else {
                this.flash = Math.floor(this.invulnTimer / 70) % 2 === 0;
            }
        }

        if (this.power > 1) {
            this.powerTimer -= delta * 1000;
            if (this.powerTimer <= 0) {
                this.power = 1;
            }
        }

        if (this.shootCooldown > 0) this.shootCooldown -= delta * 1000;

        // --- Shooting sprite logic ---
        // If shoot just pressed, set shooting sprite timer
        if (input.shoot && this.canShoot()) {
            this._shootSpriteTimer = this._shootSpriteDuration;
        } else if (this._shootSpriteTimer > 0) {
            this._shootSpriteTimer -= delta * 1000;
            if (this._shootSpriteTimer < 0) this._shootSpriteTimer = 0;
        }

        // Shield timer
        if (this.shielded) {
            this.shieldTimer -= delta * 1000;
            if (this.shieldTimer <= 0) {
                this.shielded = false;
            }
        }

        // --- Dancing Chopper Animation Timer ---
        // We increment this always, but only use it if rendering in dancing mode
        this._dancingChopperAnimTime += delta * 1000;
    }

    canShoot() {
        return this.shootCooldown <= 0 && this.alive;
    }

    shoot() {
        this.shootCooldown = this.shootDelay;
        // Set shooting sprite timer when actually shooting
        this._shootSpriteTimer = this._shootSpriteDuration;
    }

    hit() {
        if (this.shielded) {
            this.shielded = false;
            // No life lost, but brief invulnerability
            this.invulnerable = true;
            this.invulnTimer = 500;
            return false;
        }
        if (this.invulnerable || !this.alive) return false;
        this.lives -= 1;
        this.invulnerable = true;
        this.invulnTimer = this.invulnDuration;
        if (this.lives <= 0) {
            this.alive = false;
        }
        return true;
    }

    heal() {
        if (this.lives < this.maxLives) this.lives += 1;
    }

    givePower() {
        this.power = 2;
        this.powerTimer = this.powerDuration;
    }

    giveShield() {
        this.shielded = true;
        this.shieldTimer = this.shieldDuration;
    }

    // Accepts optional options object for rendering context
    render(ctx, options = {}) {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        // Flicker effect on invuln
        if (this.invulnerable && this.flash) ctx.globalAlpha = 0.4;

        // --- Dancing Chopper Powerup Animation ---
        // The renderer will pass {dancingChopper: true} if the powerup is active
        let dancingChopperActive = false;
        if (options && options.dancingChopper) {
            dancingChopperActive = true;
        } else if (
            typeof window.game !== "undefined" &&
            window.game &&
            window.game.dancingChopperActive
        ) {
            // Fallback: check global game object if available
            dancingChopperActive = true;
        }

        if (dancingChopperActive) {
            // Draw animated Dancing Chopper frames
            const frames = Player.getDancingChopperFrames();
            // Animation: cycle through frames at 10 fps (100 ms per frame)
            const frameDuration = 100; // ms
            const totalFrames = frames.length;
            const animTime = this._dancingChopperAnimTime || 0;
            const frameIdx = Math.floor(animTime / frameDuration) % totalFrames;
            const img = frames[frameIdx];

            // The intended player area is width x height
            let drawW = this.width;
            let drawH = this.height;
            let imgW = img.naturalWidth || 128;
            let imgH = img.naturalHeight || 128;
            let scale = Math.min(drawW / imgW, drawH / imgH);
            let renderW = imgW * scale;
            let renderH = imgH * scale;

            // Optionally: add a glow or effect to emphasize powerup
            ctx.save();
            ctx.globalAlpha = 0.25 + 0.10*Math.sin(animTime/80);
            ctx.beginPath();
            ctx.ellipse(0, 0, renderW*0.7, renderH*0.72, 0, 0, 2*Math.PI);
            ctx.closePath();
            ctx.fillStyle = "#ffe066";
            ctx.shadowColor = "#fd4";
            ctx.shadowBlur = 28;
            ctx.fill();
            ctx.restore();

            // Draw the frame centered
            if (img.complete && img.naturalWidth && img.naturalHeight) {
                ctx.save();
                ctx.globalAlpha = 0.96 + 0.04*Math.sin(animTime/99);
                ctx.drawImage(
                    img,
                    -renderW/2,
                    -renderH/2,
                    renderW,
                    renderH
                );
                ctx.restore();
            } else {
                // Fallback: draw a yellow rectangle
                ctx.save();
                ctx.fillStyle = "#ffe066";
                ctx.fillRect(-drawW/2, -drawH/2, drawW, drawH);
                ctx.restore();
            }

            ctx.restore();
            return;
        }

        // --- Begin sprite rendering (normal, shielded, etc) ---
        // Use damaged sprite if invulnerable (i.e., just got hit), else normal sprite
        let img;
        if (this.invulnerable) {
            img = Player.getDamagedSpriteImage();
        } else if (this.shielded && this._shootSpriteTimer > 0) {
            img = Player.getShieldedShootingSpriteImage();
        } else if (this.shielded) {
            img = Player.getShieldedSpriteImage();
        } else if (this._shootSpriteTimer > 0) {
            img = Player.getShootingSpriteImage();
        } else {
            img = Player.getSpriteImage();
        }

        // The intended player area is width x height
        // We'll scale the sprite to fit inside this area, preserving aspect ratio
        let drawW = this.width;
        let drawH = this.height;
        let imgW = img.naturalWidth || 128; // fallback if not loaded
        let imgH = img.naturalHeight || 128;
        // Compute scale to fit inside (width x height)
        let scale = Math.min(drawW / imgW, drawH / imgH);
        let renderW = imgW * scale;
        let renderH = imgH * scale;

        // --- REMOVED: Shield effect (behind sprite) ---
        // if (this.shielded) {
        //     ctx.save();
        //     ctx.globalAlpha = 0.38 + 0.13*Math.sin(Date.now()/120);
        //     ctx.beginPath();
        //     ctx.ellipse(0, 0, renderW*0.65, renderH*0.7, 0, 0, 2*Math.PI);
        //     ctx.closePath();
        //     ctx.fillStyle = "#4fc3f7";
        //     ctx.shadowColor = "#4fc3f7";
        //     ctx.shadowBlur = 24;
        //     ctx.fill();
        //     ctx.restore();
        // }

        // If the image is not loaded yet, fallback to a rectangle
        if (img.complete && img.naturalWidth && img.naturalHeight) {
            // Power glow if powered
            if (this.power > 1) {
                ctx.save();
                ctx.globalAlpha = 0.24;
                ctx.beginPath();
                ctx.ellipse(0, 0, renderW*0.6, renderH*0.6, 0, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fillStyle = "#fd4";
                ctx.shadowColor = "#ff0";
                ctx.shadowBlur = 24;
                ctx.fill();
                ctx.restore();
            }

            // Draw the sprite centered
            ctx.save();
            ctx.drawImage(
                img,
                -renderW/2,
                -renderH/2,
                renderW,
                renderH
            );
            ctx.restore();
        } else {
            // Fallback: draw a colored rectangle
            ctx.save();
            ctx.fillStyle = "#0ff";
            ctx.fillRect(-drawW/2, -drawH/2, drawW, drawH);
            ctx.restore();
        }

        ctx.restore();
    }
}
window.Player = Player;