window.addEventListener('DOMContentLoaded', () => {
    // Game object
    class SpaceShooterGame {
        constructor() {
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.background = new window.Background(1040, 480);
            this.input = new window.InputHandler();
            this.scoreManager = new window.ScoreManager();
            this.audio = new window.AudioManager();
            this.ui = new window.UIManager(this);
            this.stateManager = new window.StateManager();
            this.collision = window.CollisionSystem;
            this.renderer = new window.Renderer(this.ctx, this);
            this.gameloop = new window.GameLoop(this, this.renderer);

            this.player = null;
            this.playerBullets = [];
            this.enemyBullets = [];
            this.enemies = [];
            this.powerUps = [];
            this.explosions = [];
            this.spawnTimer = 0;
            this.powerUpTimer = 0;
            this.wave = 1;
            this.waveTimer = 0;
            this.paused = false;

            // --- LEVEL SYSTEM ---
            this.level = 1;
            this.levelTimer = 0;
            this.levelDuration = 30; // seconds per level
            this.levelTransitioning = false;

            // --- DANCING CHOPPER POWERUP SYSTEM ---
            this.dancingChopperNextTime = 0; // ms until next spawn
            this.dancingChopperActive = false;
            this.dancingChopperTimer = 0; // ms left for effect

            this._setupUI();
            this._showMenu();
        }

        _setupUI() {
            this.ui.showMenu(() => {
                this._startCountdownAndGame();
            });
        }

        _showMenu() {
            this.stateManager.setState('menu');
            this.input.setActive(false);
            this.ui.showMenu(() => this._startCountdownAndGame());
        }

        _startCountdownAndGame() {
            // Show countdown overlay for 3 seconds, preload assets
            this.stateManager.setState('countdown');
            this.input.setActive(false);

            // Preload all player sprite images
            const playerImgs = [
                window.Player.getSpriteImage(),
                window.Player.getDamagedSpriteImage(),
                window.Player.getShootingSpriteImage(),
                window.Player.getShieldedSpriteImage(), // Preload shielded sprite
                window.Player.getShieldedShootingSpriteImage() // Preload shielded+shooting sprite
            ];

            // Preload all enemy sprite images (kuromarimo idle and shooting)
            const enemyImgs = [
                window.Enemy.getKuromarimoSpriteImage(),
                window.Enemy.getKuromarimoShootingSpriteImage()
                // If you add more enemy sprite types in the future, add them here
            ];

            // Preload powerup sprite images
            const powerUpImgs = [
                window.PowerUp.getShieldSpriteImage(),
                window.PowerUp.getDancingChopperSpriteImage() // Preload Dancing Chopper sprite
            ];

            // Preload player bullet sprite image
            const playerBulletImgs = [
                window.PlayerBullet.getSpriteImage()
            ];

            // Combine all images to be preloaded
            const allImgs = [
                ...playerImgs,
                ...enemyImgs,
                ...powerUpImgs,
                ...playerBulletImgs
            ];

            // Helper to check if all images are loaded
            function isImageLoaded(img) {
                return img.complete && img.naturalWidth && img.naturalHeight;
            }

            // Wait for all images to load and countdown to finish
            let countdownDone = false;
            let imagesLoaded = allImgs.map(isImageLoaded);

            // Helper to check if both images and countdown are done
            const tryStart = () => {
                if (countdownDone && imagesLoaded.every(Boolean)) {
                    this.ui.clearCountdown();
                    this.startGame();
                }
            };

            // Listen for each image load
            allImgs.forEach((img, idx) => {
                if (imagesLoaded[idx]) {
                    // Already loaded
                } else {
                    img.addEventListener('load', () => {
                        imagesLoaded[idx] = true;
                        tryStart();
                    });
                    img.addEventListener('error', () => {
                        // Still allow game to start if image fails
                        imagesLoaded[idx] = true;
                        tryStart();
                    });
                }
            });

            // Show countdown UI
            this.ui.showCountdown(3);

            // Countdown logic
            let current = 3;
            this.ui.updateCountdown(current);
            let countdownInterval = setInterval(() => {
                current -= 1;
                if (current > 0) {
                    this.ui.updateCountdown(current);
                } else {
                    clearInterval(countdownInterval);
                    countdownDone = true;
                    tryStart();
                }
            }, 1000);

            // In case all images are already loaded
            if (imagesLoaded.every(Boolean)) {
                // But still wait for countdown
                // (tryStart will be called by countdownInterval)
            }
        }

        startGame() {
            this.stateManager.setState('playing');
            this.input.setActive(true);
            this.scoreManager.reset();
            this.wave = 1;
            this.waveTimer = 0;
            // --- LEVEL SYSTEM ---
            this.level = 1;
            this.levelTimer = 0;
            this.levelTransitioning = false;
            // --- BG: set background to level 1 ---
            if (this.background && typeof this.background.setLevel === "function") {
                this.background.setLevel(1);
            }
            // Adjusted player spawn Y to center new bigger player vertically
            this.player = new window.Player(70, 480/2-46); // was 480/2-34, now height is 92 (centered)
            this.playerBullets = [];
            this.enemyBullets = [];
            this.enemies = [];
            this.powerUps = [];
            this.explosions = [];
            this.spawnTimer = 0;
            this.powerUpTimer = 0;
            this.lastShoot = false;
            this.paused = false;
            // --- DANCING CHOPPER POWERUP SYSTEM ---
            this.dancingChopperNextTime = this._randomDancingChopperInterval();
            this.dancingChopperActive = false;
            this.dancingChopperTimer = 0;
            // this.ui.updateHUD(this.scoreManager.score, this.player.lives); // No longer needed
            this.gameloop.start();
        }

        gameOver() {
            this.audio.playGameOver();
            this.stateManager.setState('gameover');
            this.input.setActive(false);
            this.gameloop.stop();
            setTimeout(() => {
                this.ui.showGameOver(this.scoreManager.score, () => {
                    this._showMenu();
                });
            }, 700);
        }

        pauseGame() {
            if (!this.paused) {
                this.paused = true;
                this.stateManager.setState('paused');
                this.input.setActive(false);
                this.gameloop.stop();
                this.ui.showPause(() => {
                    this.resumeGame();
                });
            }
        }

        resumeGame() {
            if (this.paused) {
                this.paused = false;
                this.stateManager.setState('playing');
                this.input.setActive(true);
                this.gameloop.start();
            }
        }

        update(delta) {
            if (
                this.stateManager.is('paused') ||
                this.stateManager.is('menu') ||
                this.stateManager.is('gameover') ||
                this.stateManager.is('countdown')
            )
                return;
            // Background
            this.background.update(delta);

            // --- LEVEL SYSTEM ---
            if (!this.levelTransitioning) {
                this.levelTimer += delta;
                if (this.levelTimer >= this.levelDuration) {
                    // Level complete, transition to next level
                    this.levelTransitioning = true;
                    this._startLevelTransition();
                    return; // Pause game logic during transition
                }
            }

            // --- DANCING CHOPPER POWERUP SPAWN TIMER ---
            if (!this.levelTransitioning && this.stateManager.is('playing')) {
                this.dancingChopperNextTime -= delta * 1000;
                if (this.dancingChopperNextTime <= 0) {
                    // Only spawn if not already present
                    const alreadyPresent = this.powerUps.some(p => p.type === "dancingChopper");
                    if (!alreadyPresent) {
                        // Spawn at random Y
                        let y = 28 + 10 + Math.random()*(480-2*(28+10));
                        this.powerUps.push(new window.PowerUp(1040+30, y, "dancingChopper"));
                    }
                    // Schedule next spawn
                    this.dancingChopperNextTime = this._randomDancingChopperInterval();
                }
            }

            // Player input
            this.player.update(this.input, delta);

            // --- DANCING CHOPPER EFFECT ---
            if (this.dancingChopperActive) {
                this.dancingChopperTimer -= delta * 1000;
                if (this.dancingChopperTimer <= 0) {
                    this.dancingChopperActive = false;
                } else {
                    // Fire bullets in all directions at intervals
                    if (!this._dancingChopperFireTimer) this._dancingChopperFireTimer = 0;
                    this._dancingChopperFireTimer -= delta * 1000;
                    if (this._dancingChopperFireTimer <= 0) {
                        // Fire a ring of bullets
                        const numBullets = 16;
                        const px = this.player.x + this.player.width/2;
                        const py = this.player.y + this.player.height/2;
                        for (let i = 0; i < numBullets; ++i) {
                            const angle = (2 * Math.PI / numBullets) * i;
                            const speed = 420;
                            const vx = Math.cos(angle) * speed;
                            const vy = Math.sin(angle) * speed;
                            // PlayerBullet expects (x, y, vy, power), but we want vx and vy
                            // We'll create a custom bullet object for this effect
                            let b = new window.PlayerBullet(px, py, 0, 1);
                            b.vx = vx;
                            b.vy = vy;
                            this.playerBullets.push(b);
                        }
                        // Play shoot sound
                        this.audio.playShoot();
                        // Fire every 240ms (was 120ms) -- 50% less shots per second
                        this._dancingChopperFireTimer = 240;
                    }
                }
            } else {
                this._dancingChopperFireTimer = 0;
            }

            // Player shooting
            if (this.input.shoot && this.player.canShoot() && !this.dancingChopperActive) {
                let bx = this.player.x + this.player.width + 2;
                let by = this.player.y + this.player.height/2;
                if (this.player.power === 1) {
                    this.playerBullets.push(new window.PlayerBullet(bx, by, 0, 1));
                } else {
                    this.playerBullets.push(new window.PlayerBullet(bx, by-8, -80, 1));
                    this.playerBullets.push(new window.PlayerBullet(bx, by+8, 80, 1));
                }
                this.audio.playShoot();
                this.player.shoot();
            }

            // Bullets update
            for (let b of this.playerBullets) b.update(delta);
            this.playerBullets = this.playerBullets.filter(b => b.alive);

            for (let b of this.enemyBullets) b.update(delta);
            this.enemyBullets = this.enemyBullets.filter(b => b.alive);

            // --- Prevent enemy and powerup spawning during level transition ---
            // Only spawn enemies/powerups if NOT in level transition state
            if (!this.levelTransitioning && this.stateManager.is('playing')) {
                // Enemies update and spawn
                this.spawnTimer -= delta*1000;
                if (this.spawnTimer <= 0) {
                    this._spawnEnemy();
                    // Make spawn rate slightly faster with level
                    let minSpawn = Math.max(120, 1100 - this.level*55 - Math.random()*200);
                    this.spawnTimer = minSpawn;
                }
                for (let e of this.enemies) {
                    // Pass level to enemy update for shooting logic
                    e.update(delta, this.level);
                    // Enemy shooting
                    if (e.canShoot() && Math.random()<0.5) {
                        // --- MODIFIED: Kuromarimo (type 0) shooting speed/accuracy scales with level ---
                        let eb;
                        if (e.type === 0) {
                            // Kuromarimo: shoot faster and more accurately with level
                            // Base speed: -340, accuracy: vy in [-40,40]
                            // Increase speed up to -520 at level 10+, and accuracy window narrows
                            let minSpeed = -340 - Math.min(180, (this.level-1)*20);
                            let maxSpeed = minSpeed - 40;
                            let vx = minSpeed + Math.random()*(maxSpeed-minSpeed);
                            // Accuracy: at level 1, vy in [-40,40]; at level 10, vy in [-14,14]
                            let accRange = Math.max(12, 40 - (this.level-1)*3);
                            let vy = Math.random()*accRange*2 - accRange;
                            eb = new window.EnemyBullet(
                                e.x-12,
                                e.y,
                                vx,
                                vy,
                                e.type // pass type (0 = kuromarimo)
                            );
                        } else {
                            eb = new window.EnemyBullet(
                                e.x-12,
                                e.y,
                                -340+Math.random()*-40,
                                Math.random()*80-40,
                                e.type
                            );
                        }
                        this.enemyBullets.push(eb);
                        e.shoot(this.level);
                    }
                }
                this.enemies = this.enemies.filter(e => e.alive);

                // Power-ups
                this.powerUpTimer -= delta*1000;
                if (this.powerUpTimer <= 0) {
                    this._spawnPowerUp();
                    this.powerUpTimer = 6000 + Math.random()*8000;
                }
                for (let p of this.powerUps) p.update(delta);
                this.powerUps = this.powerUps.filter(p => p.alive);
            } else {
                // Still update existing enemies and powerups so they move offscreen/disappear
                for (let e of this.enemies) e.update(delta, this.level);
                this.enemies = this.enemies.filter(e => e.alive);
                for (let p of this.powerUps) p.update(delta);
                this.powerUps = this.powerUps.filter(p => p.alive);
            }

            // Explosions
            for (let ex of this.explosions) ex.update(delta);
            this.explosions = this.explosions.filter(ex => ex.alive);

            // Collisions: player bullets vs enemies
            for (let b of this.playerBullets) {
                for (let e of this.enemies) {
                    if (this.collision.circleCircleCollision(b.x, b.y, b.radius, e.x, e.y, e.radius)) {
                        b.alive = false;
                        let killed = e.damage(1);
                        if (killed) {
                            this.scoreManager.add(100*this.level);
                            this.audio.playExplosion();
                            this.explosions.push(new window.Explosion(e.x, e.y, e.color, true));
                        } else {
                            this.explosions.push(new window.Explosion(b.x, b.y, "#fff", false));
                        }
                        break;
                    }
                }
            }
            // Enemy bullets vs player
            for (let b of this.enemyBullets) {
                if (this.player && this.player.alive &&
                    this.collision.circleRectCollision(b.x, b.y, b.radius, this.player.x, this.player.y, this.player.width, this.player.height)
                ) {
                    b.alive = false;
                    let wasHit = this.player.hit();
                    if (wasHit) {
                        this.audio.playExplosion();
                        this.explosions.push(new window.Explosion(this.player.x+this.player.width/2, this.player.y+this.player.height/2, "#fff", true));
                        // this.ui.updateHUD(this.scoreManager.score, this.player.lives); // No longer needed
                    }
                }
            }
            // Enemies vs player
            for (let e of this.enemies) {
                if (this.player && this.player.alive &&
                    this.collision.circleRectCollision(e.x, e.y, e.radius, this.player.x, this.player.y, this.player.width, this.player.height)
                ) {
                    let wasHit = this.player.hit();
                    e.alive = false;
                    this.audio.playExplosion();
                    this.explosions.push(new window.Explosion(e.x, e.y, e.color, true));
                    if (wasHit) {
                        // this.ui.updateHUD(this.scoreManager.score, this.player.lives); // No longer needed
                        this.explosions.push(new window.Explosion(this.player.x+this.player.width/2, this.player.y+this.player.height/2, "#fff", true));
                    }
                }
            }
            // Power-ups vs player
            for (let p of this.powerUps) {
                if (this.player && this.player.alive &&
                    this.collision.circleRectCollision(p.x, p.y, p.radius, this.player.x, this.player.y, this.player.width, this.player.height)
                ) {
                    p.alive = false;
                    // Only process shield power up
                    if (p.type === "shield") {
                        this.player.giveShield();
                        this.audio.playPowerUp();
                        this.explosions.push(new window.Explosion(p.x, p.y, "#4fc3f7", false));
                    }
                    // Dancing Chopper power up
                    if (p.type === "dancingChopper") {
                        this.dancingChopperActive = true;
                        this.dancingChopperTimer = 5000; // ms
                        this._dancingChopperFireTimer = 0;
                        this.audio.playPowerUp();
                        this.explosions.push(new window.Explosion(p.x, p.y, "#fd4", false));
                    }
                    // this.ui.updateHUD(this.scoreManager.score, this.player.lives); // No longer needed
                }
            }

            // --- REMOVE OLD WAVE SYSTEM ---
            // Next wave timer
            // this.waveTimer += delta*1000;
            // if (this.waveTimer > 14000 + this.wave*2000 && this.wave < 16) {
            //     this.wave += 1;
            //     this.waveTimer = 0;
            // }

            // Update HUD
            // this.ui.updateHUD(this.scoreManager.score, this.player.lives); // No longer needed

            // Game Over
            if (this.player && !this.player.alive) {
                this.gameOver();
            }

            // Pause key
            if (this.input.pause) {
                this.input.pause = false;
                this.pauseGame();
            }
        }

        _startLevelTransition() {
            // Show level complete and new level panel for 2 seconds, then increment level and resume
            this.stateManager.setState('levelup');
            this.input.setActive(false);

            // --- CLEAR ENEMIES AND POWERUPS (and enemy bullets) ---
            this.enemies = [];
            this.powerUps = [];
            this.enemyBullets = [];

            let nextLevel = this.level + 1;
            let panel = document.createElement('div');
            panel.className = 'ui-panel';
            panel.style.zIndex = '70';
            panel.innerHTML = `
                <h1>LEVEL ${this.level} COMPLETE!</h1>
                <div class="score" style="font-size:1.3rem;margin-bottom:18px;">
                    Get ready for LEVEL ${nextLevel}...
                </div>
            `;
            // Attach as overlay above canvas
            const container = document.getElementById('game-container');
            panel.style.position = 'absolute';
            panel.style.top = '50%';
            panel.style.left = '50%';
            panel.style.transform = 'translate(-50%, -50%)';
            panel.style.pointerEvents = 'auto';
            container.appendChild(panel);
            this._levelPanel = panel;

            setTimeout(() => {
                // Remove panel, increment level, reset timer, resume game
                if (this._levelPanel) {
                    this._levelPanel.remove();
                    this._levelPanel = null;
                }
                this.level += 1;
                this.levelTimer = 0;
                this.levelTransitioning = false;
                this.stateManager.setState('playing');
                this.input.setActive(true);
                // --- BG: set background to new level ---
                if (this.background && typeof this.background.setLevel === "function") {
                    this.background.setLevel(this.level);
                }
                // Optionally: clear all remaining enemies and enemy bullets for a fresh start
                // this.enemies = [];
                // this.enemyBullets = [];
                // --- ALSO RESET SPAWN TIMERS so first spawn is not immediate ---
                this.spawnTimer = 0;
                this.powerUpTimer = 0;
                // --- DANCING CHOPPER POWERUP SYSTEM ---
                this.dancingChopperNextTime = this._randomDancingChopperInterval();
                this.dancingChopperActive = false;
                this.dancingChopperTimer = 0;
            }, 2000);
        }

        _spawnEnemy() {
            // Only spawn kuromarimo (type 0) for now, but increase number per level
            // Types: 0 = kukomarimo (blue spiky), 1 = saucer, 2 = crab
            // For now, only type 0, but keep logic for future expansion

            // Calculate how many kuromarimo should be on screen for this level
            // For example: level 1 = 2, level 2 = 3, level 3 = 4, ... up to 12
            let maxKuromarimo = Math.min(2 + Math.floor(this.level * 1.2), 12);

            // Count current kuromarimo enemies
            let currentKuro = this.enemies.filter(e => e.type === 0).length;
            if (currentKuro >= maxKuromarimo) {
                // Don't spawn more until some are killed
                return;
            }

            let t = Math.random();
            let type = 0, speed = 130 + this.level*10, hp = 1, color="#2be";
            // If you want to allow saucer/crab in future, restore below:
            // if (this.wave > 3 && t > 0.5) { type = 1; speed = 100+this.wave*13; hp = 2; color="#4fc3f7"; }
            // if (this.wave > 6 && t > 0.75) { type = 2; speed = 60+this.wave*8; hp = 3; color="#f53"; }
            // --- ADJUST kuromarimo spawn Y to avoid spawning offscreen with new bigger size ---
            // Kuromarimo radius is now 60, so diameter is 120, keep 10px margin
            let y = 60 + 10 + Math.random()*(480-2*(60+10));
            // type 0 is "kuromarimo" enemy
            let e = new window.Enemy(type, 1040+40, y, speed, hp, color);
            this.enemies.push(e);
        }

        _spawnPowerUp() {
            // PowerUp radius is now 28, so diameter is 56. Keep 10px margin from top/bottom.
            let y = 28 + 10 + Math.random()*(480-2*(28+10));
            // Only spawn shield power up
            let type = "shield";
            this.powerUps.push(new window.PowerUp(1040+30, y, type));
        }

        _randomDancingChopperInterval() {
            // Appear at least once every 30 seconds, but at random intervals
            // We'll pick a random interval between 10s and 30s (in ms)
            // But guarantee: at least once every 30s
            return 10000 + Math.random() * 20000;
        }
    }
    window.SpaceShooterGame = SpaceShooterGame;
    window.game = new SpaceShooterGame();
});