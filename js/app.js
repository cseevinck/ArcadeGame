// Declare enemies and Player
let allEnemies = [];
let player = {};

// Constants for the game
const canvasLeft = 0; // left side of canvas
const canvasRight = 400; // right side of canvas
const playerStartx = 200; // player start x coordinate
const playerStarty = 366; // player start y coordinate
const playerVertMov = 83; // player vertical movement adjustment (same as enemyRowDepth)
const enemyRowDepth = 83; // distance between enemy rows
const playerHorzMov = 100; // player horizontal movement adjustment
const enemyStartx = -100; // enemy start x coordinate
const enemyOverEndx = 100; // enemy end x coordinate beyond canvas before wrap
const enemyStarty = 34; // enemy start y coordinate
const speedInc = 25; // increase factor for speed (levels)

/**
 * Enemies Class - player must avoid these
 *
 * @class Enemy
 */
class Enemy {
    /**
     * Creates an instance of Enemy
     * @param {*} x - x coordinate of enemy
     * @param {*} y - y coordinate of enemy
     * @param {*} speed - initial speed for the emeny
     * @memberof Enemy
     */
    constructor(x, y, speed) {
        // Variables for each of instance of enemy
        this.x = x;
        this.y = y;
        this.speed = speed;

        // The image/sprite for our enemies, this uses a helper
        this.sprite = 'images/enemy-bug.png';
    };

    /**
     * Update the enemy's position
     *
     * @param {*} dt - dt, a time delta between ticks
     * @memberof Enemy
     */
    update(dt) {

        // Multiply any movement by the dt parameter which ensures
        // the game runs at the same speed for all computers
        // level * speedInc increases the speed after each level win
        this.x += (50 + (player.level * speedInc) + this.speed) * dt;


        // If this enemy is at the end of the row -> back to start
        if (this.x > canvasRight + enemyOverEndx) {
            this.resetRow(enemyStartx);
        };
    };

    /**
     * Draw the enemy on the screen
     *
     * @memberof Enemy
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    /**
     * Reset game row for one ememy & calculate speed for its next run
     *
     * @param {*} x - the row to reset
     * @memberof Enemy
     */
    resetRow(x) {
        this.x = x;
        this.speed = 90 + Math.floor(Math.random() * 500);
    };
};

/**
 * Player Class
 *
 * @class Player
 */
class Player {
    /**
     * Creates an instance of Player.
     * @param {*} x - x coordinate for player
     * @param {*} y - y coordinate for player
     * @memberof Player
     */
    constructor(x, y) {

        // Player variables
        this.x = x;
        this.y = y;
        this.sprite = 'images/char-boy.png'; // The image/sprite for player
        this.wins = 0;
        this.losses = 0;
        this.level = 0; // level 0 and normal speed
        this.turnEnded = false; // used to ignore keystrokes while player swims
    };

    /**
     * Update the player's position
     *
     * @memberof Player
     */
    update() {
        // Don't do update if we have reached the water. Want the player to
        // render for a short time - looks cool

        if (this.turnEnded) {
            return;
        };

        // Check for collision
        for (let enemy of allEnemies) {
            if (this.y === enemy.y && (enemy.x + 40 >= this.x && enemy.x - 40 <= this.x)) {
                this.losses++;
                this.turnEnded = true;
            };
        };

        // If we just found a collision - reset all ememy and player positions
        if (this.turnEnded) {
            this.restartTurn();
            this.level = 0; // back to level 0 and normal speed
        };
    };

    /**
     * Check if player reached the water (level win)
     *
     * @memberof Player
     */
    checkForAndDoWin() {
        if (this.y < enemyStarty) {
            this.wins++;
            this.turnEnded = true;
            this.level++; // increase level & enemy speed

            // player reached the water - will show the player 
            // in the water for 300ms - setTimeout to facilitate this
            setTimeout(() => {
                this.restartTurn();
            }, 300);
        };
    };

    /**
     * Restart Game - this happens when the game reset button is clicked
     * Reset the player and ememy positions and all the counts and levels 
     *
     * @memberof Player
     */
    restartGame() {
        this.wins = 0;
        this.losses = 0;
        this.level = 0; // back to level 0 and normal speed
        this.restartTurn();
    };

    /**
     * restartTurn - called when the player reached the water or on collision
     * Reset enemy and player positions. 
     *
     * @memberof Player
     */
    restartTurn() {
        this.x = playerStartx; // reset player x
        this.y = playerStarty; // reset player y
        allEnemies.forEach(function(enemy) {
            enemy.resetRow(enemyStartx);
        });
        this.turnEnded = false; // allow keystrokes again
    };

    /**
     * Draw the player on the screen & update score counts
     *
     * @memberof Player
     */
    render() {

        // Store win and loss counts & level into dom elements
        document.getElementById("win-cnt").innerHTML = this.wins;
        document.getElementById("loss-cnt").innerHTML = this.losses;
        document.getElementById("level-num").innerHTML = this.level;

        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    /**
     * HandleInput method - ensure player stays on the canvas &
     * don't allow player to move if its in the water (turnEnded)
     *
     * @param {*} key - the code of the key that was pressed
     * @memberof Player
     */
    handleInput(key) {
        if (this.turnEnded) {
            return;
        }; // ignore keystrokes while previous turn finishes
        switch (key) {
            case 'left':
                if (this.x > canvasLeft) { // left edge of canvas
                    this.x -= playerHorzMov;
                };
                break;
            case 'right':
                if (this.x < canvasRight) { // right edge of canvas
                    this.x += playerHorzMov;
                };
                break;
            case 'up':
                if (this.y >= enemyStarty) {
                    this.y -= playerVertMov;
                };

                // Process "win" if we reached water
                this.checkForAndDoWin();
                break;
            case 'down':
                if (this.y < playerStarty) {
                    this.y += playerVertMov;
                };
                break;
            default:
        };
    };
};

/**
 *  Now instantiate objects.
 *  Place all enemy objects in an array called allEnemies
 *  Place the player object in a variable called player
 */
player = new Player(playerStartx, playerStarty);
allEnemies = [
    new Enemy(enemyStartx, enemyStarty, 7000),
    new Enemy(enemyStartx, enemyStarty + enemyRowDepth, 9000),
    new Enemy(enemyStartx, enemyStarty + (enemyRowDepth * 2), 8000)
];

/*
 * This listens for key presses and sends the keys to your
 * player.handleInput() method.
 */
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});