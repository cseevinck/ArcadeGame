// Declare enemies and Player
let allEnemies = [];
let player = {};
const speedInc = 25; // increase factor for speed (levels)

/**
 * Enemies player must avoid
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
        // Variables applied to each of our instances go here,
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

        // Multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for all computers
        // level * speedInc increases the speed after each win
        this.x += (50 + (player.level * speedInc) + this.speed) * dt;


        // If this enemy is at the end of the row -> back to start
        if (this.x > 550) {
            this.resetRow(-100);
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
     * Reset game row for one ememy & get speed for its next run
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

        // Variables applied to player go here
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
        // Don't do update if we have reached the water
        if (this.turnEnded) {
            return;
        };

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
            this.level = 0; // back to level 0 and normal speed
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
        this.restartTurn();
        this.wins = 0;
        this.losses = 0;
        this.level = 0; // back to level 0 and normal speed
    };

    /**
     * restartTurn - called when the player has reached the water
     * or when a collision has accurred. 
     * Reset enemy and player positions. 
     *
     * @memberof Player
     */
    restartTurn() {
        this.x = 200; // reset player x
        this.y = 400; // reset player y
        allEnemies.forEach(function(enemy) {
            enemy.resetRow(-100);
        });
        this.turnEnded = false; // allow keystrokes again
    };

    /**
     * Draw the player on the screen & update score counts
     *
     * @memberof Player
     */
    render() {

        // Store win and loss counts into dom elements
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

                // Process "win" if we reached water
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
allEnemies = [
    new Enemy(-100, 68, 7000),
    new Enemy(-100, 151, 9000),
    new Enemy(-100, 234, 8000)
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