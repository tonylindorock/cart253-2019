// Earth
// by Yichen Wang
//
//

// Our players
let player1;
let player2;
let player1_texture;
let player2_texture;

// if single player
let singlePlayer = true;

const NUM_TREE = 10;
let num_plant = 100;
// the number of animals
const NUM_RABBIT = 20;
const NUM_BOAR = 10;
const NUM_ZEBRA = 10;
const NUM_ANTELOPE = 10;
const NUM_BISON = 10;
const NUM_ANIMALS = [NUM_RABBIT, NUM_BOAR, NUM_ZEBRA, NUM_ANTELOPE, NUM_BISON];
let num_human = 1;

// game state
let playing = false;
let gameOver = false;

let bestScore = 0;
let totalScore = 0;
let runOnce = true;

let SELECTED = "#ffd342";
// grass colors for different seasons
const SPRING = "#a0cc83";
const SUMMER = "#6fa36a";
const FALL = "#dbbf72";
const WINTER = "#a8bab4";

const SEASONS = [SPRING, SUMMER, FALL, WINTER];
// index for SEASONS array
let currentSeason;

// tree objects locations
let TreesPosX = [];
let TreesPosY = [];

let PlantsPosX = [];
let PlantsPosY = [];

let campfirePosX = 0;
let campfirePosY = 0;

const RULES = "You are the predator of the Earth." +
  "\nYou are constantly hungry so you must feast." +
  "\nEat as much prey as you can before humans hunt you down." +
  "\n(eat the red mushroom to boost your chance of survival)";

const STARTOVER = "This is not the end." +
  "\nYou may be dead, but your race lives on." +
  "\nYou can start over again.";

// all the images
let rabbit_white;
let rabbit_brown;
let boar;
let zebra;
let antelope;
let bison;
let lion;
let wolf;
let leopard;
let human;
let rabbit_white_flipped;
let rabbit_brown_flipped;
let boar_flipped;
let zebra_flipped;
let antelope_flipped;
let bison_flipped;
let lion_flipped;
let wolf_flipped;
let leopard_flipped;
let human_flipped;

let trees = [];
let plants = [];
let prey = [];
let players = [];
let predatorPro = [];

let tree_spring;
let tree_summer;
let tree_fall;
let tree_winter;

let plant_spring;
let plant_summer;
let plant_fall;
let plant_winter;

let mushroomTexture;

let camp;

// all the sounds
let spring_bg;
let summer_bg;
let fall_bg;
let winter_bg;
let bg_music = [];
let eaten_sound;
let newRecord_sound;
let noNewRecord_sound;

let playOnce = true;

// preload()
//
// Load all the image and sound sources
function preload() {
  rabbit_white = loadImage("assets/images/Rabbit_W.png");
  rabbit_brown = loadImage("assets/images/Rabbit_B.png");
  boar = loadImage("assets/images/Boar.png");
  zebra = loadImage("assets/images/Zebra.png");
  antelope = loadImage("assets/images/Antelope.png");
  bison = loadImage("assets/images/Bison.png");
  lion = loadImage("assets/images/Lion.png");
  wolf = loadImage("assets/images/Wolf.png");
  leopard = loadImage("assets/images/Leopard.png");
  human = loadImage("assets/images/Man.png");

  rabbit_white_flipped = loadImage("assets/images/Rabbit_W_flipped.png");
  rabbit_brown_flipped = loadImage("assets/images/Rabbit_B_flipped.png");
  boar_flipped = loadImage("assets/images/Boar_flipped.png");
  zebra_flipped = loadImage("assets/images/Zebra_flipped.png");
  antelope_flipped = loadImage("assets/images/Antelope_flipped.png");
  bison_flipped = loadImage("assets/images/Bison_flipped.png");
  lion_flipped = loadImage("assets/images/Lion_flipped.png");
  wolf_flipped = loadImage("assets/images/Wolf_flipped.png");
  leopard_flipped = loadImage("assets/images/Leopard_flipped.png");
  human_flipped = loadImage("assets/images/Man_flipped.png");

  tree_spring = loadImage("assets/images/Tree_Spring.png");
  tree_summer = loadImage("assets/images/Tree_Summer.png");
  tree_fall = loadImage("assets/images/Tree_Fall.png");
  tree_winter = loadImage("assets/images/Tree_Winter.png");

  plant_spring = loadImage("assets/images/Plant_Spring.png");
  plant_summer = loadImage("assets/images/Plant_Summer.png");
  plant_fall = loadImage("assets/images/Plant_Fall.png");
  plant_winter = loadImage("assets/images/Plant_Winter.png");

  mushroomTexture = loadImage("assets/images/Mushroom.png");
  camp = loadImage("assets/images/Camp.png");

  spring_bg = loadSound("assets/sounds/Spring.mp3");
  summer_bg = loadSound("assets/sounds/Summer.mp3");
  fall_bg = loadSound("assets/sounds/Fall.mp3");
  winter_bg = loadSound("assets/sounds/Winter.mp3");
  bg_music = [spring_bg,summer_bg,fall_bg,winter_bg];
  eaten_sound = loadSound("assets/sounds/Eaten.mp3");
  newRecord_sound = loadSound("assets/sounds/Lion_Roar.mp3");
  noNewRecord_sound = loadSound("assets/sounds/Wolf_Cry.mp3");
}

// setup()
//
// Sets up a canvas
// Creates objects for the predator and three prey
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textFont('Helvetica');
  textStyle(BOLD);
  imageMode(CENTER);
  rectMode(CENTER);
  noStroke();

  mushroom = new Mushroom(random(0, width),random(0, height),30,mushroomTexture);
  currentSeason = int(random(0, 4));
  randomizeTreesPos();
  randomizePlantsPos();
  setupBG();

  append(players, lion);
  append(players, wolf);
  append(players, leopard);
  append(players, lion_flipped);
  append(players, wolf_flipped);
  append(players, leopard_flipped);
  setupPlayer();
  // create player1 object
  player1 = new Predator(100, 100, 2, 30, player1_texture, player1_texture_flipped, 87, 83, 65, 68, 70);

  // set up prey objects
  setUpPrey();
  setupHuman();
}

// setUpPrey()
//
// set up the prey objects
function setUpPrey() {
  prey = [];
  for (let i = 0; i < 5; i++) {
    let num_animal = NUM_ANIMALS[i];
    let animal_id = i;
    for (let j = 0; j < num_animal; j++) {
      let preyX = random(0, width);
      let preyY = random(0, height);
      let preySpeed = 0;
      let preyRadius = 0;
      let texture;
      let texture_flipped;
      // rabbit
      if (animal_id === 0) {
        preySpeed = random(3, 5);
        preyRadius = random(10, 15);
        if (currentSeason === 2 || currentSeason === 3) {
          texture = rabbit_brown;
          texture_flipped = rabbit_brown_flipped;
        } else {
          texture = rabbit_white;
          texture_flipped = rabbit_white_flipped;
        }
        // boar
      } else if (animal_id === 1) {
        preySpeed = random(0.5, 3);
        preyRadius = random(20, 25);
        texture = boar;
        texture_flipped = boar_flipped;
        // zebra, antelope, and bison
      } else if (animal_id >= 2) {
        preySpeed = random(1, 3);
        preyRadius = random(25, 30);
        // zebra
        if (animal_id === 2) {
          texture = zebra;
          texture_flipped = zebra_flipped;
          // antelope
        } else if (animal_id === 3) {
          texture = antelope;
          texture_flipped = antelope_flipped;
          //bison
        } else if (animal_id === 4) {
          texture = bison;
          texture_flipped = bison_flipped;
        }
      }
      let preyObj = new Prey(preyX, preyY, preySpeed, preyRadius, texture, texture_flipped);
      prey.push(preyObj);
    }
  }
}

function setupHuman() {
  predatorPro = [];
  for (let i = 0; i < num_human; i++) {
    let humanX = random(50, width-50);
    let humanY = random(50, height-50);
    campfirePosX = humanX;
    campfirePosY = humanY;
    let humanSpeed = 3;
    let humanRadius = random(25, 30);
    let humanObj = new PredatorPro(humanX, humanY, humanSpeed, humanRadius, human, human_flipped);
    predatorPro.push(humanObj);
  }
}

function addHuman() {
  if(num_human<50){
    let humanSpeed = 3;
    let humanRadius = random(25, 30);
    let humanObj = new PredatorPro(campfirePosX, campfirePosY, humanSpeed, humanRadius, human, human_flipped);
    num_human++;
    predatorPro.push(humanObj);
  }
}

function setupPlayer() {
  let randomIndex = int(random(0, 3));
  player1_texture = players[randomIndex];
  player1_texture_flipped = players[randomIndex + 3];
  randomIndex = int(random(0, 3));
  player2_texture = players[randomIndex];
  player2_texture_flipped = players[randomIndex + 3];
}

// setupBG()
//
// set up the background of the game by randomly selecting a season in an array
// and display certain other BG elements
function setupBG() {
  trees = [];
  plants = [];
  num_plant = 100;
  if (currentSeason === 0) {
    for (let i = 0; i < NUM_TREE; i++) {
      let treeObj = new Tree(TreesPosX[i], TreesPosY[i], 60, tree_spring);
      trees.push(treeObj);
    }
    for (let j = 0; j < num_plant; j++) {
      let plantObj = new Plant(PlantsPosX[j], PlantsPosY[j], 30, plant_spring);
      plants.push(plantObj);
    }
  } else if (currentSeason === 1) {
    for (let i = 0; i < NUM_TREE; i++) {
      let treeObj = new Tree(TreesPosX[i], TreesPosY[i], 60, tree_summer);
      trees.push(treeObj);
    }
    for (let j = 0; j < num_plant; j++) {
      let plantObj = new Plant(PlantsPosX[j], PlantsPosY[j], 30, plant_summer);
      plants.push(plantObj);
    }
  } else if (currentSeason === 2) {
    for (let i = 0; i < NUM_TREE; i++) {
      let treeObj = new Tree(TreesPosX[i], TreesPosY[i], 60, tree_fall);
      trees.push(treeObj);
    }
    for (let j = 0; j < num_plant; j++) {
      let plantObj = new Plant(PlantsPosX[j], PlantsPosY[j], 30, plant_fall);
      plants.push(plantObj);
    }
  } else if (currentSeason === 3) {
    num_plant = 50;
    for (let i = 0; i < NUM_TREE; i++) {
      let treeObj = new Tree(TreesPosX[i], TreesPosY[i], 60, tree_winter);
      trees.push(treeObj);
    }
    for (let j = 0; j < num_plant; j++) {
      let plantObj = new Plant(PlantsPosX[j], PlantsPosY[j], 30, plant_winter);
      plants.push(plantObj);
    }
  }
}

function drawBG() {
  background(SEASONS[currentSeason]);
  for (let j = 0; j < plants.length; j++) {
    plants[j].display();
  }
  image(camp,campfirePosX,campfirePosY,60,60);
  for (let i = 0; i < trees.length; i++) {
    trees[i].display();
  }
  mushroom.display();

}

function nextSeason() {
  currentSeason += 1;
  if (currentSeason > 3) {
    currentSeason = 0;
  }
  setupBG();
}

function randomizeTreesPos() {
  for (let i = 0; i < NUM_TREE; i++) {
    TreesPosX[i] = random(0, width);
    TreesPosY[i] = random(0, height);
  }
}

function randomizePlantsPos() {
  for (let i = 0; i < num_plant; i++) {
    PlantsPosX[i] = random(0, width);
    PlantsPosY[i] = random(0, height);
  }
}

// draw()
//
// Handles input, movement, eating, and displaying for the system's objects
function draw() {
  // Clear the background to black
  drawBG();
  if (!playing && !gameOver) {
    for (let i = 0; i < prey.length; i++) {
      prey[i].move();
      prey[i].display(playing);
      predatorPro[0].handleEating(prey[i]);
      for (let j = 0; j < num_plant; j++) {
        prey[i].handleEating(plants[j]);
      }
    }
    for (let j = 0; j < predatorPro.length; j++) {
      predatorPro[j].move();
      predatorPro[j].display(playing);
    }

    fill(0, 50);
    rect(width / 2, height / 2, width, height);
    showMainMenu();
    checkMainMenuButtons();

  } else if (playing) {
    if(!bg_music[currentSeason].isPlaying()){
      if(currentSeason===0){
        bg_music[3].setVolume(0);
      }else{
        bg_music[(currentSeason-1)].setVolume(0);
      }
      bg_music[currentSeason].setVolume(0.2);
      bg_music[currentSeason].play();
    }
    checkGameOver();
    checkScore();
    for (let i = 0; i < prey.length; i++) {
      prey[i].move();
      prey[i].display(playing);
      for (let j = 0; j < num_plant; j++) {
        prey[i].handleEating(plants[j]);
      }
      for (let j = 0; j < NUM_TREE; j++) {
        prey[i].collide(trees[j]);
      }
      if (!player1.dead) {
        player1.handleEating(prey[i]);
      }
      if (!singlePlayer) {
        if (!player2.dead) {
          player2.handleEating(prey[i]);
        }
      }
      for (let j = 0; j < num_human; j++) {
        predatorPro[j].handleEating(prey[i]);
        for (let k = 0; k < NUM_TREE; k++) {
          predatorPro[j].collide(trees[k]);
        }
      }
    }
    // Handle input for the player
    // if players are dead, they can not be able to move anymore
    if (singlePlayer) {
      displayScore(player1, null);
      if (!player1.dead) {
        player1.handleInput();
        player1.move();
        for (let k = 0; k < NUM_TREE; k++) {
          player1.collide(trees[k]);
        }
      }
      // leave player's score on the screen
      player1.display();
      checkEatingMushroom(player1);
      removeMushroomEffect();
    } else {
      displayScore(player1, player2);
      if (!player1.dead) {
        player1.handleInput();
        player1.move();
        for (let k = 0; k < NUM_TREE; k++) {
          player1.collide(trees[k]);
        }
      }
      if (!player2.dead) {
        player2.handleInput();
        player2.move();
        for (let k = 0; k < NUM_TREE; k++) {
          player2.collide(trees[k]);
        }
      }

      player1.display();
      player2.display();
      checkEatingMushroom(player1);
      checkEatingMushroom(player2);
      removeMushroomEffect();
    }
    for (let j = 0; j < num_human; j++) {
      predatorPro[j].move();
      predatorPro[j].display(playing);
      if (!player1.dead) {
        predatorPro[j].hunting(player1);
        player1.attacking(predatorPro[j]);
      }
      if (!singlePlayer) {
        if (!player2.dead) {
          predatorPro[j].hunting(player2);
          player2.attacking(predatorPro[j]);
        }
      }
    }
    if (gameOver) {
      fill(0, 50);
      rect(width / 2, height / 2, width, height);
      displayGameOver();
    }
  }

}

function displayScore(player1, player2) {
  push();
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(64);
  let prevScore = totalScore;
  if (singlePlayer) {
    totalScore = int(player1.score);
    text(totalScore, width / 2, 50);
  } else {
    totalScore = int(player1.score + player2.score);
    text(totalScore, width / 2, 50);
  }
  if (prevScore < totalScore) {
    runOnce = true;
  }
  if (mushroom.inEffect){
    textSize(32);
    fill(random(255),random(255),random(255));
    if(mushroom.effectId===0){
      text("SUPER RUNNER",width / 2, 100);
    }else{
      text("SUPER HUNTER",width / 2, 100);
    }
  }
  pop();
}

function checkScore() {
  if (totalScore % 10 === 0 && totalScore >= 10 && runOnce) {
    addHuman();
    if (totalScore % 20 === 0 && totalScore >= 20) {
      nextSeason();
    }
    runOnce = false;
  }
}

function checkEatingMushroom(player) {
  let d = dist(player.x, player.y, mushroom.x, mushroom.y);
  let playerId = 0;
  let p = 0;
  if (d < player.radius + 15) {
    if (player.sprintKey === 70) {
      playerId = 1;
    } else {
      playerId = 2;
    }
    if (!mushroom.inEffect) {
      mushroom.reset();
      p = random(0, 1);
      if (p < 0.5) {
        player.speed *= 2;
        mushroom.effectId = 0;
      } else {
        player.healthGainPerEat *= 2;
        mushroom.effectId = 1;
      }
      mushroom.inEffect = true;
      mushroom.effectPlayerId = playerId;
      mushroom.prevScore = totalScore;
    }
  }
}

function removeMushroomEffect() {
  if (mushroom.prevScore === totalScore - 5 && mushroom.inEffect) {
    mushroom.inEffect = false;
    if (mushroom.effectPlayerId === 1) {
      player1.speed = player1.originalSpeed;
      player1.healthGainPerEat = player1.originalHealthPerEat;
    } else if (mushroom.effectPlayerId === 2) {
      player2.speed = player2.originalSpeed;
      player2.healthGainPerEat = player2.originalHealthPerEat;
    }
  }
}

// checkGameOver()
//
// check if the players are dead
function checkGameOver() {
  if (singlePlayer) {
    if (player1.dead) {
      gameOver = true;
      mushroom.inEffect = false;
    }
  } else {
    if (player1.dead && player2.dead) {
      gameOver = true;
      mushroom.inEffect = false;
    }
  }
}

// displayGameOver()
//
// display game over text
function displayGameOver() {
  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(64);
  if (bestScore < totalScore) {
    fill(SELECTED);
    text("YOU GOT A NEW RECORD!", width / 2, height / 2 - 200);
    textSize(64);
    text(totalScore, width / 2, 50);
    textSize(32);
    fill(255);
    text("YOUR PREV BEST SCORE: " + bestScore, width / 2, height / 2 - 150);

    if(!newRecord_sound.isPlaying() && playOnce){
      newRecord_sound.setVolume(0.2);
      newRecord_sound.play();
      playOnce = false;
    }
  } else {
    fill(SELECTED);
    text("YOU CAN DO BETTER!", width / 2, height / 2 - 200);
    textSize(64);
    text(totalScore, width / 2, 50);
    textSize(32);
    fill(255);
    text("YOUR BEST SCORE: " + bestScore, width / 2, height / 2 - 150);

    if(!noNewRecord_sound.isPlaying() && playOnce){
      noNewRecord_sound.setVolume(0.2);
      noNewRecord_sound.play();
      playOnce = false;
    }
  }
  fill(255,100);
  ellipse(100,100,120);
  image(player1_texture, 100, 100, player1.radius * 2, player1.radius * 2);
  fill(255);
  textSize(32);
  text(STARTOVER, width / 2, height / 2 - 25);
  textSize(32);
  textAlign(RIGHT, CENTER);
  text("play as one", width / 2 - 100, height / 2 + 100);
  text("WASD KEYS\nF to sprint", width / 2 - 100, height / 2 + 190);
  textAlign(LEFT, CENTER);
  text("play as two", width / 2 + 100, height / 2 + 100);
  text("ARROWKEYS\nL to sprint", width / 2 + 100, height / 2 + 190);
  pop();

  checkGameOverButtons();
}

// checkGameOverButtons()
//
// check buttons in game over screen
// handle game restart and reset all the objects
function checkGameOverButtons() {
  push();
  textSize(32);
  fill(255);
  if (mouseX < width / 2) {
    textAlign(RIGHT, CENTER);
    fill(SELECTED);
    text("play as one", width / 2 - 100, height / 2 + 100);
    fill(255);
    textAlign(LEFT, CENTER);
    text("play as two", width / 2 + 100, height / 2 + 100);
    // reset all colors of prey and player
    // reset game stats
    if (mouseIsPressed) {
      background(100);
      if(bestScore<totalScore){
        bestScore = totalScore;
      }
      player1 = new Predator(100, 100, 2, 30, player1_texture, player1_texture_flipped, 87, 83, 65, 68, 70);
      num_human = 1;
      setUpPrey();
      setupHuman();
      gameOver = false;
      singlePlayer = true;

      playOnce = true;
    }
  } else {
    fill(255,100);
    ellipse(width-100,100,120);
    image(player2_texture, width-100, 100, player1.radius * 2, player1.radius * 2);
    textAlign(RIGHT, CENTER);
    text("play as one", width / 2 - 100, height / 2 + 100);
    fill(SELECTED);
    textAlign(LEFT, CENTER);
    text("play as two", width / 2 + 100, height / 2 + 100);
    // reset all colors of prey and two players
    // reset game stats
    if (mouseIsPressed) {
      if(bestScore<totalScore){
        bestScore = totalScore;
      }
      player1 = new Predator(100, 100, 2, 30, player1_texture, player1_texture_flipped, 87, 83, 65, 68, 70);
      player2 = new Predator(width - 100, 100, 2, 30, player2_texture, player2_texture_flipped, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, 76);
      setUpPrey();
      num_human = 2;
      setupHuman();
      gameOver = false;
      singlePlayer = false;

      playOnce = true;
    }
  }
  pop();
}

// showMainMenu()
//
// display the main menu before the game
function showMainMenu() {
  push();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(255);
  text(RULES, width / 2, height / 2 - 150);
  textSize(128);
  text("E A R T H", width / 2, height / 2);
  textSize(32);
  textAlign(RIGHT, CENTER);
  text("play as one", width / 2 - 100, height / 2 + 120);
  text("WASD KEYS\nF to sprint", width / 2 - 100, height / 2 + 190);
  textAlign(LEFT, CENTER);
  text("play as two", width / 2 + 100, height / 2 + 120);
  text("ARROWKEYS\nL to sprint", width / 2 + 100, height / 2 + 190);

  fill(255,100);
  ellipse(100,100,120);
  image(player1_texture, 100, 100, player1.radius * 2, player1.radius * 2);
  pop();
}

// checkMainMenuButtons()
//
// check the buttons in main menu
// handle whether the game is started in single player
function checkMainMenuButtons() {
  push();
  noStroke();
  textSize(32);
  // single player
  if (mouseX < width / 2) {
    fill(SELECTED);
    textAlign(RIGHT, CENTER);
    text("play as one", width / 2 - 100, height / 2 + 120);
    fill(255);
    textAlign(LEFT, CENTER);
    text("play as two", width / 2 + 100, height / 2 + 120);
    if (mouseIsPressed) {
      playing = true;
      singlePlayer = true;
    }
    // two players
  } else {
    fill(255,100);
    ellipse(width-100,100,120);
    image(player2_texture, width-100, 100, player1.radius * 2, player1.radius * 2);
    fill(255);
    textAlign(RIGHT, CENTER);
    text("play as one", width / 2 - 100, height / 2 + 120);
    fill(SELECTED);
    textAlign(LEFT, CENTER);
    text("play as two", width / 2 + 100, height / 2 + 120);
    if (mouseIsPressed) {
      playing = true;
      singlePlayer = false;
      player2 = new Predator(width - 100, 100, 2, 30, player2_texture, player2_texture_flipped, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, 76);
      addHuman();
    }
  }
  pop();
}
