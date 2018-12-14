let allEnemies = [];
let player = {};

// Enemies our player must avoid
class Enemy {
    constructor(x, y, velocity) {
        // Variables applied to each of our instances go here,
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        // The image/sprite for our enemies, this uses a helper
        this.sprite = 'images/enemy-bug.png';
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {

        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += (50 + this.velocity) * dt;

        // See if this enemy is at the end of the row
        if (this.x > 550) {
            this.restartRow(-100);
        };
    };

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    // Restart game - all the ememies
    restart() {
        this.getVelocity();

        // reset all enemy positions 
        allEnemies.forEach(function(enemy) {
            enemy.restartRow(-100);
        });
    };

    // Restart game row
    restartRow(x) {
        this.x = x;
        this.getVelocity();
    };

    // Get new random velocity 
    getVelocity() {
        this.velocity = 90 + Math.floor(Math.random() * 500);
    };
};

// Create class for player
// Requires update(), render() and handleInput() method.
class Player {
    constructor(x, y) {
        // Variables applied to each of our instances go here,
        this.x = x;
        this.y = y;
        // The image/sprite for our player, this uses a helper
        this.sprite = 'images/char-boy.png';
    }

    // Update the player's position, required method for game
    update() {
        for (let enemy of allEnemies) {
            if (this.y === enemy.y && (enemy.x + 40 >= this.x && enemy.x - 40 <= this.x)) {
                // alert('crash');
                allEnemies[0].restart(-100);
                this.restart();
            }
        };
    };

    // Check of player reached the water (Game win) 
    reachedWater() {
        if (this.y < 100) {
            setTimeout(function() {
                player.restart();
                // use the restart method in the first enemy to reset all
                // make player visible in the water for 1/2 second
                allEnemies[0].restart(-100);
            }, 500);
        };
    };

    // Restart game
    restart() {
        this.x = 200;
        this.y = 400;
    };

    // Draw the player on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    // HandleInput method - ensure player stays on the canvas & 
    // don't allow player to move if its in the water
    handleInput(key) {
        switch (key) {
            case 'left':
                if ((this.x > 50) && (this.y > 70)) {
                    this.x -= 100;
                }
                break;
            case 'right':
                if ((this.x < 350) && (this.y > 70)) {
                    this.x += 100;
                }
                break;
            case 'up':
                if (this.y > 67) {
                    this.y -= 83;
                }
                // See if we reached water (game win)
                this.reachedWater();
                break;
            case 'down':
                if ((this.y < 350) && (this.y > 70)) {
                    this.y += 83;
                }
                break;
            default:
        };
    };
};

// Now instantiate objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
player = new Player(200, 400);
allEnemies = [new Enemy(-50, 68, 7000), new Enemy(-50, 151, 9000), new Enemy(-50, 234, 8000)];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. 
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});