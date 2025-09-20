class Background {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        // Starfield
        this.stars = [];
        this.starSpeedBase = 0.5;
        for (let i = 0; i < 68; ++i) {
            this.stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.4 + 0.3,
                speed: Math.random() * 0.7 + this.starSpeedBase
            });
        }
        // --- LEVEL-BASED BG LAYERS ---
        this.level = 1;
        this.bgLayers = this._getBgLayersForLevel(this.level);
    }

    setLevel(level) {
        // Called when level changes
        this.level = level;
        this.bgLayers = this._getBgLayersForLevel(level);
        // Reset offsets so new layers animate from zero
        for (let layer of this.bgLayers) {
            layer.offset = 0;
        }
    }

    _getBgLayersForLevel(level) {
        // Return an array of bg layer objects for the given level
        // Each layer: { offset, speed, draw(ctx, w, h, offset) }
        // Level 1: original
        if (level === 1) {
            return [
                { // Distant nebula
                    offset: 0,
                    speed: 0.07,
                    draw: (ctx, w, h, offset) => {
                        ctx.save();
                        let grad = ctx.createRadialGradient(
                            w*0.8, h*0.4, 40+8*Math.sin(offset/14),
                            w*0.8, h*0.4, 200
                        );
                        grad.addColorStop(0, "rgba(56,130,255,0.22)");
                        grad.addColorStop(1, "rgba(0,0,20,0)");
                        ctx.globalAlpha = 0.85;
                        ctx.beginPath();
                        ctx.arc(w*0.8, h*0.4, 180+8*Math.sin(offset/14), 0, Math.PI*2);
                        ctx.closePath();
                        ctx.fillStyle = grad;
                        ctx.fill();
                        ctx.globalAlpha = 1;
                        ctx.restore();
                    }
                },
                { // Planet
                    offset: 0,
                    speed: 0.13,
                    draw: (ctx, w, h, offset) => {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(w*0.18 - offset%w, h*0.75, 76, 0, Math.PI*2);
                        let grad = ctx.createRadialGradient(
                            w*0.18 - offset%w, h*0.75, 20,
                            w*0.18 - offset%w, h*0.75, 76
                        );
                        grad.addColorStop(0, "#ffe0b2");
                        grad.addColorStop(0.45, "#d3a85c");
                        grad.addColorStop(1, "#a67318");
                        ctx.fillStyle = grad;
                        ctx.globalAlpha = 0.33;
                        ctx.fill();
                        ctx.globalAlpha = 1;
                        ctx.restore();
                    }
                }
            ];
        } else if (level === 2) {
            // Pink nebula, purple planet
            return [
                { // Distant pink nebula
                    offset: 0,
                    speed: 0.09,
                    draw: (ctx, w, h, offset) => {
                        ctx.save();
                        let grad = ctx.createRadialGradient(
                            w*0.7, h*0.32, 36+10*Math.sin(offset/11),
                            w*0.7, h*0.32, 170
                        );
                        grad.addColorStop(0, "rgba(255,120,210,0.18)");
                        grad.addColorStop(1, "rgba(0,0,20,0)");
                        ctx.globalAlpha = 0.85;
                        ctx.beginPath();
                        ctx.arc(w*0.7, h*0.32, 145+10*Math.sin(offset/11), 0, Math.PI*2);
                        ctx.closePath();
                        ctx.fillStyle = grad;
                        ctx.fill();
                        ctx.globalAlpha = 1;
                        ctx.restore();
                    }
                },
                { // Purple planet
                    offset: 0,
                    speed: 0.17,
                    draw: (ctx, w, h, offset) => {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(w*0.22 - offset%w, h*0.8, 62, 0, Math.PI*2);
                        let grad = ctx.createRadialGradient(
                            w*0.22 - offset%w, h*0.8, 16,
                            w*0.22 - offset%w, h*0.8, 62
                        );
                        grad.addColorStop(0, "#f6d6ff");
                        grad.addColorStop(0.5, "#b97aff");
                        grad.addColorStop(1, "#5e2b7b");
                        ctx.fillStyle = grad;
                        ctx.globalAlpha = 0.38;
                        ctx.fill();
                        ctx.globalAlpha = 1;
                        ctx.restore();
                    }
                }
            ];
        } else if (level === 3) {
            // Green nebula, teal planet
            return [
                { // Distant green nebula
                    offset: 0,
                    speed: 0.08,
                    draw: (ctx, w, h, offset) => {
                        ctx.save();
                        let grad = ctx.createRadialGradient(
                            w*0.82, h*0.5, 30+12*Math.sin(offset/9),
                            w*0.82, h*0.5, 170
                        );
                        grad.addColorStop(0, "rgba(100,255,180,0.18)");
                        grad.addColorStop(1, "rgba(0,0,20,0)");
                        ctx.globalAlpha = 0.82;
                        ctx.beginPath();
                        ctx.arc(w*0.82, h*0.5, 130+12*Math.sin(offset/9), 0, Math.PI*2);
                        ctx.closePath();
                        ctx.fillStyle = grad;
                        ctx.fill();
                        ctx.globalAlpha = 1;
                        ctx.restore();
                    }
                },
                { // Teal planet
                    offset: 0,
                    speed: 0.15,
                    draw: (ctx, w, h, offset) => {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(w*0.15 - offset%w, h*0.7, 70, 0, Math.PI*2);
                        let grad = ctx.createRadialGradient(
                            w*0.15 - offset%w, h*0.7, 18,
                            w*0.15 - offset%w, h*0.7, 70
                        );
                        grad.addColorStop(0, "#e0fff6");
                        grad.addColorStop(0.5, "#51f7e7");
                        grad.addColorStop(1, "#0a7b7b");
                        ctx.fillStyle = grad;
                        ctx.globalAlpha = 0.34;
                        ctx.fill();
                        ctx.globalAlpha = 1;
                        ctx.restore();
                    }
                }
            ];
        } else if (level === 4) {
            // Orange nebula, red planet
            return [
                { // Orange nebula
                    offset: 0,
                    speed: 0.1,
                    draw: (ctx, w, h, offset) => {
                        ctx.save();
                        let grad = ctx.createRadialGradient(
                            w*0.75, h*0.35, 38+10*Math.sin(offset/12),
                            w*0.75, h*0.35, 180
                        );
                        grad.addColorStop(0, "rgba(255,180,80,0.18)");
                        grad.addColorStop(1, "rgba(0,0,20,0)");
                        ctx.globalAlpha = 0.82;
                        ctx.beginPath();
                        ctx.arc(w*0.75, h*0.35, 150+10*Math.sin(offset/12), 0, Math.PI*2);
                        ctx.closePath();
                        ctx.fillStyle = grad;
                        ctx.fill();
                        ctx.globalAlpha = 1;
                        ctx.restore();
                    }
                },
                { // Red planet
                    offset: 0,
                    speed: 0.19,
                    draw: (ctx, w, h, offset) => {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(w*0.19 - offset%w, h*0.78, 66, 0, Math.PI*2);
                        let grad = ctx.createRadialGradient(
                            w*0.19 - offset%w, h*0.78, 14,
                            w*0.19 - offset%w, h*0.78, 66
                        );
                        grad.addColorStop(0, "#fff0f0");
                        grad.addColorStop(0.5, "#ff7a7a");
                        grad.addColorStop(1, "#b72b2b");
                        ctx.fillStyle = grad;
                        ctx.globalAlpha = 0.36;
                        ctx.fill();
                        ctx.globalAlpha = 1;
                        ctx.restore();
                    }
                }
            ];
        } else if (level === 5) {
            // Blue nebula, icy planet
            return [
                { // Blue nebula
                    offset: 0,
                    speed: 0.12,
                    draw: (ctx, w, h, offset) => {
                        ctx.save();
                        let grad = ctx.createRadialGradient(
                            w*0.85, h*0.45, 36+10*Math.sin(offset/10),
                            w*0.85, h*0.45, 190
                        );
                        grad.addColorStop(0, "rgba(90,200,255,0.18)");
                        grad.addColorStop(1, "rgba(0,0,20,0)");
                        ctx.globalAlpha = 0.85;
                        ctx.beginPath();
                        ctx.arc(w*0.85, h*0.45, 170+10*Math.sin(offset/10), 0, Math.PI*2);
                        ctx.closePath();
                        ctx.fillStyle = grad;
                        ctx.fill();
                        ctx.globalAlpha = 1;
                        ctx.restore();
                    }
                },
                { // Icy planet
                    offset: 0,
                    speed: 0.21,
                    draw: (ctx, w, h, offset) => {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(w*0.25 - offset%w, h*0.73, 60, 0, Math.PI*2);
                        let grad = ctx.createRadialGradient(
                            w*0.25 - offset%w, h*0.73, 12,
                            w*0.25 - offset%w, h*0.73, 60
                        );
                        grad.addColorStop(0, "#e0f7ff");
                        grad.addColorStop(0.5, "#aaf7ff");
                        grad.addColorStop(1, "#2b7bb7");
                        ctx.fillStyle = grad;
                        ctx.globalAlpha = 0.38;
                        ctx.fill();
                        ctx.globalAlpha = 1;
                        ctx.restore();
                    }
                }
            ];
        } else {
            // For level > 5, cycle through the above with a color shift
            // We'll use a hue rotation overlay
            const baseLayers = this._getBgLayersForLevel(((level-1)%5)+1);
            // Add a hue shift overlay layer
            const hueShift = ((level-1)*60)%360;
            // We'll return a proxy array that draws the base layers, then draws a hue overlay
            return [
                ...baseLayers,
                {
                    offset: 0,
                    speed: 0,
                    draw: (ctx, w, h, offset) => {
                        // Overlay a transparent rectangle with a hue rotation effect
                        // Since canvas doesn't support hue-rotate, we fake it with a colored overlay
                        ctx.save();
                        ctx.globalAlpha = 0.10 + 0.06*Math.sin(offset/13);
                        ctx.fillStyle = `hsl(${hueShift}, 80%, 60%)`;
                        ctx.fillRect(0, 0, w, h);
                        ctx.globalAlpha = 1;
                        ctx.restore();
                    }
                }
            ];
        }
    }

    update(delta) {
        for (let star of this.stars) {
            star.x -= star.speed * delta * 0.06;
            if (star.x < 0) {
                star.x = this.width + Math.random() * 30;
                star.y = Math.random() * this.height;
                star.r = Math.random() * 1.2 + 0.3;
                star.speed = Math.random() * 0.7 + this.starSpeedBase;
            }
        }
        for (let layer of this.bgLayers) {
            layer.offset += layer.speed * delta;
        }
    }
    render(ctx) {
        // Parallax bg layers
        for (let layer of this.bgLayers) {
            layer.draw(ctx, this.width, this.height, layer.offset);
        }
        // Starfield
        ctx.save();
        for (let star of this.stars) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI*2);
            ctx.globalAlpha = Math.random()*0.2+0.65;
            ctx.fillStyle = "#fff";
            ctx.shadowColor = "#cce8ff";
            ctx.shadowBlur = 7;
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.restore();
    }
}
window.Background = Background;