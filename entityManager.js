(function() {
    class EntityManager {
        constructor() {
            this.enemies = [];
            this.projectiles = [];
            this.enemyProjectiles = [];
            this.powerUps = [];
        }
        reset() {
            this.enemies.length = 0;
            this.projectiles.length = 0;
            this.enemyProjectiles.length = 0;
            this.powerUps.length = 0;
        }
    }
    window.EntityManager = EntityManager;
})();