# Classic Arcade Game Clone Project

## Table of Contents

- [Instructions](#instructions)
- [Contributing](#contributing)

## Instructions

Use this [rubric](https://review.udacity.com/#!/rubrics/15/view) for self-checking your submission.

Make sure the functions you write are **object-oriented** - either class functions (like `Player` and `Enemy`) or class prototype functions such as `Enemy.prototype.checkCollisions`. Also make sure that the keyword `this` is used appropriately within your class and class prototype functions to refer to the object the function is called upon.

Your **README.md** file should be updated with instructions on both how to 1. Run and 2. Play your arcade game.

For detailed instructions on how to get started, check out this [guide](https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub?embedded=true).

## Contributing

This repository is the starter code for _all_ Udacity students. Therefore, we most likely will not accept pull requests.

## Game Rules

The goal of the game is to reach the water while avoiding getting hit by the bugs. When the player reaches the water the win count is increased. This also increases the level number and also the speed of the bugs. If you get hit you lose and the loss count is increased and the level and speed is reset. The reset button resets the counts and level.

## Control

Use the keyboard arrow keys to control the player movement direction.

## Note

The code has been updated to use ES6 classes
I added some code to allow the player to be seen for 300ms in the water. It looked incomplete when the player went back down before it was actually in the water. 

## Credits
References: stackoverflow.com, w3schools.com, Youtube.com, developer.mozilla.org, css-tricks.com, Udacity lectures, javascript.info, geeksforgeeks.org, and other sites I found online.

## Changes by Cornelis Seevinck