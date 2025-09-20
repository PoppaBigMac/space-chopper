class CollisionSystem {
    static circleRectCollision(cx, cy, cr, rx, ry, rw, rh) {
        // closest point on rect to circle
        let closestX = Math.max(rx, Math.min(cx, rx+rw));
        let closestY = Math.max(ry, Math.min(cy, ry+rh));
        let dx = cx-closestX, dy = cy-closestY;
        return dx*dx + dy*dy < cr*cr;
    }
    static circleCircleCollision(x1, y1, r1, x2, y2, r2) {
        let dx = x1-x2, dy = y1-y2;
        return dx*dx + dy*dy < (r1+r2)*(r1+r2);
    }
}
window.CollisionSystem = CollisionSystem;