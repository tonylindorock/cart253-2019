// Predator
//
// A class that represents a simple predator
// controlled by the arrow keys and/or WASD. It can move around
// the screen and consume Prey objects to maintain its health.

class Predator {

  // constructor
  //
  // Sets the initial values for the Predator's properties
  // Either sets default values or uses the arguments provided
  constructor(x, y, speed, strokeColor, radius, upKey,downKey,leftKey,rightKey,sprintKey) {
    // Position
    this.x = x;
    this.y = y;
    // Velocity and speed
    this.vx = 0;
    this.vy = 0;
    this.speed = speed;
    this.speedUp = 2; // when sprint
    // Health properties
    this.maxHealth = radius;
    this.health = this.maxHealth; // Must be AFTER defining this.maxHealth
    this.healthLossPerMove = 0.1;
    this.healthGainPerEat = 1;
    // Display properties
    this.strokeColor = strokeColor;
    this.radius = this.health; // Radius is defined in terms of health
    // Input properties
    this.upKey = upKey;
    this.downKey = downKey;
    this.leftKey = leftKey;
    this.rightKey = rightKey;
    this.sprintKey = sprintKey;
    // record score
    this.score = 0;
    this.dead = false;
  }

  // handleInput
  //
  // Checks if an arrow key is pressed and sets the predator's
  // velocity appropriately.
  handleInput() {
    // Horizontal movement
    if (keyIsDown(this.sprintKey)){ // when sprinting multiply speedUp to the speed
      if (keyIsDown(this.leftKey)) {
        this.vx = -this.speed*this.speedUp;
      }else if (keyIsDown(this.rightKey)) {
        this.vx = this.speed*this.speedUp;
      }else {
        this.vx = 0;
      }
      // Vertical movement
      if (keyIsDown(this.upKey)) {
        this.vy = -this.speed*this.speedUp;
      }else if (keyIsDown(this.downKey)) {
        this.vy = this.speed*this.speedUp;
      }else {
        this.vy = 0;
      }
    }else{
      if (keyIsDown(this.leftKey)) {
        this.vx = -this.speed;
      }else if (keyIsDown(this.rightKey)) {
        this.vx = this.speed;
      }else {
        this.vx = 0;
      }
      // Vertical movement
      if (keyIsDown(this.upKey)) {
        this.vy = -this.speed;
      }else if (keyIsDown(this.downKey)) {
        this.vy = this.speed;
      }else {
        this.vy = 0;
      }
    }
  }

  // move
  //
  // Updates the position according to velocity
  // Lowers health (as a cost of living)
  // Handles wrapping
  move() {
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    // Update health
    this.health = this.health - this.healthLossPerMove;
    this.health = constrain(this.health, 0, this.maxHealth);

    if (this.health<= 0){
      this.dead = true;
    }
    // Handle wrapping
    this.handleWrapping();
  }

  // handleWrapping
  //
  // Checks if the predator has gone off the canvas and
  // wraps it to the other side if so
  handleWrapping() {
    // Off the left or right
    if (this.x < 0) {
      this.x += width;
    }
    else if (this.x > width) {
      this.x -= width;
    }
    // Off the top or bottom
    if (this.y < 0) {
      this.y += height;
    }
    else if (this.y > height) {
      this.y -= height;
    }
  }

  // handleEating
  //
  // Takes a Prey object as an argument and checks if the predator
  // overlaps it. If so, reduces the prey's health and increases
  // the predator's. If the prey dies, it gets reset.
  handleEating(prey) {
    // Calculate distance from this predator to the prey
    let d = dist(this.x, this.y, prey.x, prey.y);
    // Check if the distance is less than their two radii (an overlap)
    if (d < this.radius + prey.radius) {
      // Increase predator health and constrain it to its possible range
      this.health += this.healthGainPerEat;
      this.health = constrain(this.health, 0, this.maxHealth);
      // Decrease prey health by the same amount
      prey.health -= this.healthGainPerEat;
      // Check if the prey died and reset it if so
      if (prey.health < 2) {
        prey.reset();
        this.score ++;
      }
    }
  }

  // display
  //
  // Draw the predator as an ellipse on the canvas
  // with a radius the same size as its current health.
  // Also print the score underneath
  display() {
    push();
    strokeWeight(8);
    stroke(this.strokeColor);
    fill(255);
    this.radius = this.health;
    ellipse(this.x, this.y, this.radius * 2);
    noStroke();
    textAlign(CENTER,CENTER);
    textSize(16);
    text("score: "+this.score,this.x, this.y+this.radius+10);
    pop();
  }
}
