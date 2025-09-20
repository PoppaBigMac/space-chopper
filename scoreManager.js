class ScoreManager {
    constructor() {
        this.score = 0;
    }
    add(amount) {
        this.score += amount;
    }
    reset() {
        this.score = 0;
    }
}
window.ScoreManager = ScoreManager;