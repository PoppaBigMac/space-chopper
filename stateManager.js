class StateManager {
    constructor() {
        this.state = "menu"; // menu, playing, paused, gameover
    }
    setState(s) {
        this.state = s;
    }
    is(state) {
        return this.state === state;
    }
}
window.StateManager = StateManager;