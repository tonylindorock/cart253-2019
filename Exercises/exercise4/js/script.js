"use strict";

// Pong PLUS
// Modified by Yichen Wang
//
// A "simple" implementation of Pong with no scoring system
// just the ability to play the game with the keyboard.
//
// Up and down keys control the right hand paddle, W and S keys control
// the left hand paddle

// Whether the game has started
let playing = false;

// colors RGB for background
let r;
let g;
let b;

// paddle score rank (colors)
let FINE = "#FFFFFF"; // white
let GOOD = "#45ff4e"; // green
let GREAT = "#00eaff"; // blue
let EXCEL = " #ffde38"; // gold
let PERFECT = "#ff7373"; // red

// BALL

// A ball object with the properties of
// position, size, velocity, and speed
let ball = {
  x: 0,
  y: 0,
  size: 20,
  vx: 0,
  vy: 0,
  speed: 5
}

// PADDLES

// Basic definition of a left paddle object with its key properties of
// position, size, velocity, and speed
// score counts and lastScored
let leftPaddle = {
  x: 0,
  y: 0,
  w: 20,
  h: 70,
  vy: 0,
  speed: 5,
  upKey: 87,
  downKey: 83,
  score: 0,
  lastScored: false,
  id: 0
}

// RIGHT PADDLE

// Basic definition of a left paddle object with its key properties of
// position, size, velocity, and speed
// score counts and lastScored
let rightPaddle = {
  x: 0,
  y: 0,
  w: 20,
  h: 70,
  vy: 0,
  speed: 5,
  upKey: 38,
  downKey: 40,
  score: 0,
  lastScored: false,
  id: 1
}

let winner = "";
let gameOver = false;

// A variable to hold the beep sound we will play on bouncing
let beepSFX;

// preload()
//
// Loads the beep audio for the sound of bouncing
function preload() {
  beepSFX = loadSound("assets/sounds/beep.wav");
  beepSFX.setVolume(0.25);
}

// setup()
//
// Creates the canvas, sets up the drawing modes,
// Sets initial values for paddle and ball positions
// and velocities.
function setup() {
  // Create canvas and set drawing modes
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  ellipseMode(CENTER);
  noStroke();
  fill(255);
  textFont("Arial");

  // give r, g, b random values and set them as background
  setColor();
  background(r,g,b);

  setupPaddles();
  resetBall();
}

// setupPaddles()
//
// Sets the starting positions of the two paddles
function setupPaddles() {
  // Initialise the left paddle position
  leftPaddle.x = 0 + leftPaddle.w;
  leftPaddle.y = height / 2;

  // Initialise the right paddle position
  rightPaddle.x = width - rightPaddle.w;
  rightPaddle.y = height / 2;
}

// draw()
//
// Calls the appropriate functions to run the game
// See how tidy it looks?!
function draw() {
  // Fill the background
  background(r,g,b);

  if (playing && !gameOver) {
    // If the game is in play, we handle input and move the elements around
    handleInput(leftPaddle);
    handleInput(rightPaddle);
    updatePaddle(leftPaddle);
    updatePaddle(rightPaddle);
    updateBall();

    checkBallWallCollision();
    checkBallPaddleCollision(leftPaddle);
    checkBallPaddleCollision(rightPaddle);

    // Check if the ball went out of bounds and respond if so
    // (Note how we can use a function that returns a truth value
    // inside a conditional!)
    if (ballIsOutOfBounds()) {
      // If it went off either side, reset it
      resetBall();
      // This is where we would likely count points, depending on which side
      // the ball went off...
      checkWinner(leftPaddle);
      checkWinner(rightPaddle);
    }
  }else if(gameOver){
    gameOverScreen();
  }else {
    // Otherwise we display the message to start the game
    displayStartMessage();
  }

  // We always display the paddles and ball so it looks like Pong!
  push();
  displayPaddleRank(leftPaddle);
  displayPaddle(leftPaddle);
  pop();
  push();
  displayPaddleRank(rightPaddle);
  displayPaddle(rightPaddle);
  pop();
  displayBall();
}

function setColor(){
  // 74 - 161 gives nice slightly dark color
  r = random(74,161);
  g = random(74,161);
  b = random(74,161);
}

// handleInput()
//
// Checks the mouse and keyboard input to set the velocities of the
// left and right paddles respectively.
function handleInput(paddle) {
  // Move the paddle based on its up and down keys
  // If the up key is being pressed
  if (keyIsDown(paddle.upKey)) {
    // Move up
    paddle.vy = -paddle.speed;
  }
  // Otherwise if the down key is being pressed
  else if (keyIsDown(paddle.downKey)) {
    // Move down
    paddle.vy = paddle.speed;
  }
  else {
    // Otherwise stop moving
    paddle.vy = 0;
  }
}

// updatePositions()
//
// Sets the positions of the paddles and ball based on their velocities
function updatePaddle(paddle) {
  // Update the paddle position based on its velocity
  paddle.y += paddle.vy;
}

// updateBall()
//
// Sets the position of the ball based on its velocity
function updateBall() {
  // Update the ball's position based on velocity
  ball.x += ball.vx;
  ball.y += ball.vy;
}

// ballIsOutOfBounds()
//
// Checks if the ball has gone off the left or right
// Returns true if so, false otherwise
function ballIsOutOfBounds() {
  // Check for ball going off the sides
  if (ball.x < 0 || ball.x > width) {
    if (ball.x < 0){
      rightPaddle.score += 1;
      rightPaddle.lastScored = true;
      leftPaddle.lastScored = false;
    }else if(ball.x > width){
      leftPaddle.score += 1;
      leftPaddle.lastScored = true;
      rightPaddle.lastScored = false;
    }
    console.log("left: "+leftPaddle.score+"\nright: "+rightPaddle.score);
    return true;
  }
  else {
    return false;
  }
}

// checkBallWallCollision()
//
// Check if the ball has hit the top or bottom of the canvas
// Bounce off if it has by reversing velocity
// Play a sound
function checkBallWallCollision() {
  // Check for collisions with top or bottom...
  if (ball.y < 0 || ball.y > height) {
    // It hit so reverse velocity
    ball.vy = -ball.vy;
    // Play our bouncing sound effect by rewinding and then playing
    beepSFX.currentTime = 0;
    beepSFX.play();
  }
}

// checkBallPaddleCollision(paddle)
//
// Checks for collisions between the ball and the specified paddle
function checkBallPaddleCollision(paddle) {
  // VARIABLES FOR CHECKING COLLISIONS

  // We will calculate the top, bottom, left, and right of the
  // paddle and the ball to make our conditionals easier to read...
  let ballTop = ball.y - ball.size / 2;
  let ballBottom = ball.y + ball.size / 2;
  let ballLeft = ball.x - ball.size / 2;
  let ballRight = ball.x + ball.size / 2;

  let paddleTop = paddle.y - paddle.h / 2;
  let paddleBottom = paddle.y + paddle.h / 2;
  let paddleLeft = paddle.x - leftPaddle.w / 2;
  let paddleRight = paddle.x + paddle.w / 2;

  // First check the ball is in the vertical range of the paddle
  if (ballBottom > paddleTop && ballTop < paddleBottom) {
    // Then check if it is touching the paddle horizontally
    if (ballLeft < paddleRight && ballRight > paddleLeft) {
      // Then the ball is touching the paddle
      // Reverse its vx so it starts travelling in the opposite direction
      ball.vx = -ball.vx;
      // Play our bouncing sound effect by rewinding and then playing
      if (!beepSFX.isPlaying()){
        beepSFX.currentTime = 0;
        beepSFX.play();
      }
    }
  }
}

// displayPaddle(paddle)
//
// Draws the specified paddle
function displayPaddle(paddle) {
  // Draw the paddles
  push();
  stroke(255);
  strokeWeight(4);
  rect(paddle.x, paddle.y, paddle.w, paddle.h,32,32,32,32);
  pop();
}

function displayPaddleRank(paddle){
  if (paddle.score<5){
    fill(FINE);
  }
  else if (paddle.score>=5 && paddle.score<10){
    fill(GOOD);
  }else if(paddle.score>= 10 && paddle.score<15){
    fill(GREAT);
  }else if(paddle.score>=15 && paddle.score<20){
    fill(EXCEL);
  }else if(paddle.score>=20){
    fill(PERFECT);
  }
}

function checkWinner(paddle){
  if(paddle.score>=20){
    if(paddle.id === 0){
      winner = "left";
    }else if (paddle.id === 1){
      winner = "right";
    }
    gameOver = true;
    playing = false;
  }
}

// displayBall()
//
// Draws the ball on screen as a square
function displayBall() {
  // Draw the ball
  ellipse(ball.x, ball.y, ball.size);
}

// resetBall()
//
// Sets the starting position and velocity of the ball
function resetBall() {
  let randDir = random();
  // Initialise the ball's position and velocity
  ball.x = width / 2;
  ball.y = height / 2;
  ball.vx = ball.speed;
  if (leftPaddle.lastScored){
    ball.vx = -ball.vx;
  }else if (rightPaddle.lastScored){
    ball.vx = ball.vx;
  }else{
    if(0.5<=randDir<1){
      ball.vx = -ball.vx;
    }
  }
  ball.vy = random(ball.speed,ball.speed*1.5);
}

// displayStartMessage()
//
// Shows a message about how to start the game
function displayStartMessage() {
  push();
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(48);
  text("PONG PLUS", width / 2, height / 2 - 300);
  textSize(32);
  text("try not to let the ball go off your side of the edge", width / 2, height / 2 - 256);
  textSize(28);
  text("the first player reaches 20 points win", width / 2, height / 2 - 216);
  textSize(32);
  textAlign(LEFT, CENTER);
  text("WASD",width / 2-500,height / 2);
  textAlign(RIGHT, CENTER);
  text("ARROWKEYS",width / 2+500,height / 2);
  textAlign(CENTER, CENTER);
  textSize(100);
  text("CLICK TO START", width / 2, height / 2 + 256);
  pop();
}

function gameOverScreen(){
  push();
  background(r,g,b);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(48);
  text("THE PLAYER OF THE "+winner+" WON!",width / 2, height / 2);
  textSize(100);
  text("CLICK TO RESTART", width / 2, height / 2 + 256);
  pop();
}

// mousePressed()
//
// Here to require a click to start playing the game
// Which will help us be allowed to play audio in the browser
function mousePressed() {
  if (!playing && !gameOver){
    playing = true;
  }else if (gameOver){
    playing = true;
    gameOver = false;
  }
}
