(function() {
    class LevelManager {
        constructor() {
            this.level = 1;
            this.waveTimer = 0;
            this.waveInterval = 2000;
            this.spawnedThisWave = 0;
            this.waveSize = 0;
        }
        reset() {
            this.level = 1;
            this.waveTimer = 0;
            this.spawnedThisWave = 0;
            this.waveSize = 0;
        }
        nextWave() {
            this.level += 1;
            this.waveInterval = Math.max(700, 2600 - this.level*100);
            this.spawnedThisWave = 0;
            this.waveSize = Math.min(6 + Math.floor(this.level*1.35), 18);
        }
        update(dt, entityManager, canvasWidth, rng) {
            this.waveTimer -= dt;
            if (this.waveTimer <= 0 && this.spawnedThisWave < this.waveSize) {
                // Spawn enemy
                const type = (this.level >= 3 && Math.random() < 0.27) ? 1 : 0;
                let x = 30 + rng() * (canvasWidth - 60 - 32);
                let y = -40;
                entityManager.enemies.push(new window.Enemy(x, y, type, this.level));
                this.spawnedThisWave++;
                this.waveTimer = this.waveInterval / this.waveSize;
            }
        }
    }
    window.LevelManager = LevelManager;
})();