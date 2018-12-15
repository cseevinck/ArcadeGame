// Declare enemies and Player
let allEnemies = [];
let player = {};

/**
 * Enemies our player must avoid
 *
 * @class Enemy
 */
class Enemy {
    /**
     * Creates an instance of Enemy.
     * @param {*} x - x coordinate of enemy
     * @param {*} y - y coordinate of enemy
     * @param {*} velocity for the emeny
     * @memberof Enemy
     */
    constructor(x, y, velocity) {
        // Variables applied to each of our instances go here,
        this.x = x;
        this.y = y;
        this.velocity = velocity;

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

        // Multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for all computers
        this.x += (50 + this.velocity) * dt;

        // If this enemy is at the end of the row -> back to start
        if (this.x > 550) {
            this.restartRow(-100);
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
     * Restart game row - all the ememies
     *
     * @memberof Enemy
     */
    restartRow(x) {
        this.x = x;
        this.getVelocity(); // get velocity for next run
    };

    /**
     * Get new random velocity
     *
     * @memberof Enemy
     */
    getVelocity() {
        this.velocity = 90 + Math.floor(Math.random() * 500);
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

        // Variables applied to each of our instances go here,
        this.x = x;
        this.y = y;
        this.sprite = 'images/char-boy.png'; // The image/sprite for our player, this uses a helper
        this.wins = 0;
        this.losses = 0;
        this.turnEnded = false; // after a win or a loss
    };

    /**
     * Update the player's position
     *
     * @memberof Player
     */
    update() {
        // Don't do update if we have reached the water
        if (this.turnEnded) { return; };

        // Check for collision
        for (let enemy of allEnemies) {
            if (this.y === enemy.y && (enemy.x + 40 >= this.x && enemy.x - 40 <= this.x)) {
                if (!this.turnEnded) {
                    this.losses++;
                    this.turnEnded = true;
                };
            };
        };

        // If we just found a collition - reset all ememy and player positions
        if (this.turnEnded) {
            this.restartTurn();
        };
    };

    /**
     * Check if player reached the water (game win)
     *
     * @memberof Player
     */
    reachedWater() {
        if (this.y < 68) {
            this.wins++;
            this.turnEnded = true;

            // player reached the water - y coordinate will show the player 
            // in the water for 300ms - setTimeout to facilitate this
            setTimeout(() => {
                this.restartTurn();
            }, 300);
        };
    };

    /**
     * Restart Game - this happens when the game reset button is clicked
     *
     * @memberof Player
     */
    restartGame() {
        this.restartTurn();
        this.wins = 0;
        this.losses = 0;
    };

    /**
     * restartTurn - Called when the player has reached the water
     * or when a collision has accurred. 
     * Reset enemy and player positions. 
     *
     * @memberof Player
     */
    restartTurn() {
        this.x = 200;
        this.y = 400;
        allEnemies.forEach(function(enemy) {
            enemy.restartRow(-100);
        });
        this.turnEnded = false; // allow keystrokes again
    };

    /**
     * Draw the player on the screen
     *
     * @memberof Player
     */
    render() {

        // Store win and loss counts into dom elements
        document.getElementById("win-cnt").innerHTML = this.wins;
        document.getElementById("loss-cnt").innerHTML = this.losses;

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
        if (this.turnEnded) { return; }; // ignore keystrokes while previous turn finishes
        switch (key) {
            case 'left':
                if (this.x > 50) {
                    this.x -= 100;
                };
                break;
            case 'right':
                if (this.x < 350) {
                    this.x += 100;
                };
                break;
            case 'up':
                if (this.y > 67) {
                    this.y -= 83;
                };

                // See if we reached water (game win)
                this.reachedWater();
                break;
            case 'down':
                if (this.y < 350) {
                    this.y += 83;
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
player = new Player(200, 400);
allEnemies = [new Enemy(-50, 68, 7000), new Enemy(-50, 151, 9000), new Enemy(-50, 234, 8000)];

/*
 * This listens for key presses and sends the keys to your
 * Player.handleInput() method.
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