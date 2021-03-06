/******************************************************

Game - The Artful Dodger (Plus)
Modified by Yichen Wang

A (refined) simple dodging game with keyboard controls

******************************************************/

// The position and size of our avatar circle
let avatarX;
let avatarY;
let avatarSize = 50;

// The speed and velocity of our avatar circle
let avatarSpeed = 10;
let avatarVX = 0;
let avatarVY = 0;

// The position and size of the enemy circle
let enemyX;
let enemyY;
let enemyX2; // second enemy x position for hard mode
let enemyY2; // second enemy y position for hard mode
let enemyXs; // glitch pixel x pos for hard mode
let enemyYs; // glitch pixel y pos for hard mode
let DEFAULT_ENEMYSIZE = 50; // default value for enemy size
let enemySize = DEFAULT_ENEMYSIZE;

let DEFAULT_ENEMYSPEED = 5; // default value for enemy speed
// The speed and velocity of our enemy circle
let enemySpeed = DEFAULT_ENEMYSPEED;
let enemyVX = 5;
let ememyVXs = 5; // glitch pixel velocity

// colors for enemy
let randomGreen;
let randomBlue;

// How many dodges the player has made
let dodges = 0;
let bestScore = 0;
// effect timer
let effectTime = 0;

// determining whether the game is starting
let gameStart = false;
// the difficulty of the game
let hardMode = false;
// which game mode the player chooses
let gameMode = "EASY";
// special effect
let in_Effect = false;
// original backgroud rgb colors: dark blue (43,47,79)
let bG_R = 43;
let bG_G = 47;
let bG_B = 79;

// setup()
// Make the canvas, position the avatar and anemy
function setup() {
  // Create our playing area
  createCanvas(480,640);

  // Put the avatar in the centre
  avatarX = width/2;
  avatarY = height/2;

  // Put the enemy to the left at a random y coordinate within the canvas
  enemyX = 0;
  enemyX2 = 0; // second x position for hard mode
  enemyXs = -10; // glitch pixel x pos for hard mode
  enemyY = random(0,height);
  enemyY2 = random(0,height); // second random y position for hard mode
  enemyYs = random(0,height); // glitch pixel random y pos for hard mode

  // random colors for enemy
  randomGreen = random(0,255);
  randomBlue = random(0,255);

  // No stroke so it looks cleaner
  noStroke();

  // The main menu setup
  background(bG_R,bG_G,bG_B); // dark blue backgroud
  fill(255);
  textAlign(CENTER);
  textFont("Helvetica"); // ui font
  textSize(40);
  text("THE ARTFUL DODGER",avatarX,avatarY); // Title
  textSize(32);
  textStyle(BOLD);
  text("EASY",avatarX,avatarY+50); // easy button
  text("HARD",avatarX,avatarY+100); // hard button
  textSize(20);
  textStyle(ITALIC);
  text("Use arrowkeys or WASD to dodge other circles!\n\nCatch glitch pixel in hard mode\nwill enable special effects...",avatarX,avatarY+150); // rule
}

// draw()
// Handle moving the avatar and enemy and checking for dodges and
// game over situations.
function draw() {
  // This is the simple control for the main menu
  // If the mouse hovers over the "EASY" or "HARD" button, the text color changes

  // This is when easy button hovering
    if (dist(mouseX,mouseY,avatarX,avatarY+50) < 25){
      fill("255");
      textSize(40);
      textStyle(NORMAL);
      text("THE ARTFUL DODGER",avatarX,avatarY);
      fill("#8effbd"); // GREEN
      textSize(32);
      textStyle(BOLD);
      text("EASY",avatarX,avatarY+50); // easy button
      fill(255);
      text("HARD",avatarX,avatarY+100); // hard button
      textSize(20);
      textStyle(ITALIC);
      text("Use arrowkeys or WASD to dodge other circles!\n\nCatch glitch pixel in hard mode\nwill enable special effects...",avatarX,avatarY+150);
      // If the mouse is pressed, the game will start in easy mode
      if (mouseIsPressed){
        gameStart = true;
      }
    // This is when hard button hovering
    }else if (dist(mouseX,mouseY,avatarX,avatarY+100) < 25){
      fill(255);
      textSize(40);
      textStyle(NORMAL);
      text("THE ARTFUL DODGER",avatarX,avatarY);
      textSize(32);
      textStyle(BOLD);
      text("EASY",avatarX,avatarY+50);
      fill("#ff7474"); // RED
      text("HARD",avatarX,avatarY+100);
      fill(255);
      textSize(20);
      textStyle(ITALIC);
      text("Use arrowkeys or WASD to dodge other circles!\n\nCatch glitch pixel in hard mode\nwill enable special effects...",avatarX,avatarY+150);
      // If the mouse is pressed, the game will start in hard mode
      // glitch pixel will spawn
      if (mouseIsPressed){
        gameStart = true;
        hardMode = true;
        gameMode = "HARD";
      }
    // when the mouse is not hovering any buttons, the buttons go back to normal
    }else{
      textStyle(NORMAL);
      fill(255);
      textSize(40);
      text("THE ARTFUL DODGER",avatarX,avatarY); // Title
      textSize(32);
      textStyle(BOLD);
      text("EASY",avatarX,avatarY+50); // easy button
      text("HARD",avatarX,avatarY+100);
      textSize(20);
      textStyle(ITALIC);
      text("Use arrowkeys or WASD to dodge other circles!\n\nCatch glitch pixel in hard mode\nwill enable special effects...",avatarX,avatarY+150);
    }

  // When mouse clicks either easy or hard, game will start
  if (gameStart){
    // set the background
    background(bG_R,bG_G,bG_B);
    // The scores and game mode text
    fill("#ffcd59"); // Gold
    textSize(16);
    textStyle(BOLD);
    textAlign(LEFT);
    text("DODGED: "+dodges,350,30);
    text(gameMode,25,30);
    text("BEST: "+bestScore,25,45);

    // Default the avatar's velocity to 0 in case no key is pressed this frame
    avatarVX = 0;
    avatarVY = 0;

    // Check which keys are down and set the avatar's velocity based on its
    // speed appropriately

    // Left and right
    if (keyIsDown(LEFT_ARROW)||keyIsDown(65)) {
      avatarVX = -avatarSpeed;
    }
    else if (keyIsDown(RIGHT_ARROW)||keyIsDown(68)) {
      avatarVX = avatarSpeed;
    }

    // Up and down (separate if-statements so you can move vertically and
    // horizontally at the same time)
    if (keyIsDown(UP_ARROW)||keyIsDown(87)) {
      avatarVY = -avatarSpeed;
    }
    else if (keyIsDown(DOWN_ARROW)||keyIsDown(83)) {
      avatarVY = avatarSpeed;
    }

    // Move the avatar according to its calculated velocity
    avatarX = avatarX + avatarVX;
    avatarY = avatarY + avatarVY;

    // The enemy always moves at enemySpeed
    enemyVX = enemySpeed;
    ememyVXs = enemySpeed*1.5; // glitch pixel will be faster
    // Update the enemy's position based on its velocity
    enemyX = enemyX + enemyVX;
    if (hardMode){
      enemyX2 = enemyX2 + enemyVX;
      // if the player is having a special effect, glitch pixel will not respawn
      if (!in_Effect){
        enemyXs = enemyXs + ememyVXs;
      }
    }


    // Check if the enemy and avatar overlap - if they do the player loses
    // We do this by checking if the distance between the centre of the enemy
    // and the centre of the avatar is less that their combined radii
    if (dist(enemyX,enemyY,avatarX,avatarY) < enemySize/2 + avatarSize/2 ) {
      // Tell the player they lost
      console.log("YOU LOSE!");
      // Reset the enemy's position
      enemyX = 0;
      enemyY = random(0,height);
      if (hardMode){
        enemyX2 = 0;
        enemyY2 = random(0,height);
        enemyXs = -30;
        enemyYs = random(0,height);
      }
      // Reset the avatar's position
      avatarX = width/2;
      avatarY = height/2;
      // remember the best score
      if (dodges > bestScore){
        bestScore = dodges;
      }
      text("BEST: "+bestScore,25,45);
      // Reset the dodge counter
      dodges = 0;
      // reset special effect
      in_Effect = false;
      // reset enemy size and speed
      enemySpeed = DEFAULT_ENEMYSPEED;
      enemySize = DEFAULT_ENEMYSIZE;
      // default size for avatar is the same as the enemy
      avatarSize = DEFAULT_ENEMYSIZE;
      // reset background
      bG_R = 43;
      bG_G = 47;
    }
    // second enemy checking for hard mode
    if (hardMode){
      if (dist(enemyX,enemyY2,avatarX,avatarY) < enemySize/2 + avatarSize/2 ){
        console.log("YOU LOSE!");
        enemyX = 0;
        enemyY = random(0,height);
        enemyX2 = 0
        enemyY2 = random(0,height);
        enemyXs = -30;
        enemyYs = random(0,height);

        avatarX = width/2;
        avatarY = height/2;

        if (dodges > bestScore){
          bestScore = dodges;
        }
        text("BEST: "+bestScore,25,45);
        dodges = 0;
        in_Effect = false;

        enemySpeed = DEFAULT_ENEMYSPEED;
        enemySize = DEFAULT_ENEMYSIZE;
        avatarSize = DEFAULT_ENEMYSIZE;

        bG_R = 43;
        bG_G = 47;
      }
      // the glitch pixel for hard mode
      if (dist(enemyXs,enemyYs,avatarX,avatarY) < enemySize/2 + avatarSize/2 ){
        console.log("SOMETHING HAPPENED!");
        // randomly choose an effect when player touches it
        var n = int(random(0,3));
        if (n==0){
          dodges += 5; // plus 5 points
        }else if (n==1){
          avatarSize += 20; // enlarge avatar
        }else{
          avatarSize -= 20; // shrink avatar
        }
        // reset pos
        enemyXs = -30;
        enemyYs = random(0,height);
        // begin wait time
        effectTime = dodges;
        in_Effect = true;
      }
    }

    // Check if the avatar has gone off the screen (cheating!)
    if (avatarX < 0 || avatarX > width || avatarY < 0 || avatarY > height) {
      // If they went off the screen they lose in the same way as above.
      console.log("YOU LOSE!");

      enemyX = 0;
      enemyY = random(0,height);
      if (hardMode){
        enemyY2 = random(0,height);
        enemyX2 = 0;
        enemyXs = -30;
        enemyYs = random(0,height);
      }

      avatarX = width/2;
      avatarY = height/2;

      if (dodges > bestScore){
        bestScore = dodges;
      }
      text("BEST: "+bestScore,25,45);
      dodges = 0;
      in_Effect = false;

      enemySpeed = DEFAULT_ENEMYSPEED;
      enemySize = DEFAULT_ENEMYSIZE;
      avatarSize = DEFAULT_ENEMYSIZE;

      bG_R = 43;
      bG_G = 47;
    }

    // Check if the enemy has moved all the way across the screen
    if (enemyX > width) {
      // This means the player dodged so update its dodge statistic
      dodges = dodges + 1;
      // after earning 5 more points, special effect will reset
      // and glitch pixel will respawn again
      if (effectTime+5==dodges){
        in_Effect = false;
        avatarSize = DEFAULT_ENEMYSIZE;
      }
      // the background will change color after each 10 points
      if (dodges%10==0 && dodges!=0){
        // 43-79 range will keep it dark and consistent
        bG_R = random(43,80);
        bG_G = random(43,80);
      }
      // enemy speed and size will increase after each successful dodge
      enemySpeed += 0.05;
      enemySize += 5;
      // different color for the enemy
      randomGreen = random(0,255);
      randomBlue = random(0,255);
      // Tell them how many dodges they have made
      console.log(dodges + " DODGES!");
      // Reset the enemy's position to the left at a random height
      enemyX = 0;
      enemyY = random(0,height);
      if (hardMode){
        enemyX2 = 0;
        enemyY2 = random(0,height);
        enemyXs = -30;
        enemyYs = random(0,height);
      }
    }

    // Display the number of successful dodges in the console
    console.log(dodges);

    // The player is white
    fill(255);
    // Draw the player as a circle
    ellipse(avatarX,avatarY,avatarSize);

    // The enemy is random colored
    fill(255,randomGreen,randomBlue);
    // Draw the enemy as one circle in easy mode and two circles in hard mode
    if (hardMode){
      ellipse(enemyX,enemyY,enemySize);
      ellipse(enemyX2,enemyY2,enemySize);
      fill(random(0,200),random(0,200),random(0,200)); // glitch effect
      rect(enemyXs,enemyYs,25,25); // the glitch pixel
    }else{
      ellipse(enemyX,enemyY,enemySize);
    }
  }
}
