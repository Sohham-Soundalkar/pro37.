//Create variables here
var dog, dogImage, happyDog, dogHappy, database, foodS, foodStock;
var database, position;
var Milkbottle, MilkbottleImage;
var feed, addFood;
var foodObj;
var bedroomImage, gardenImage, washroomImage;
var sadDog, readState;

function preload()
{
  //load images here
  dogImage = loadImage("dogImg.png");
  dogHappy = loadImage("dogImg1.png");
  bedroomImage = loadImage("Bed Room.png");
  gardenImage = loadImage("Garden.png");
  washroomImage = loadImage("Wash Room.png");
  sadDog = loadImage("deadDog.png");  
}
  
function setup() {
  database = firebase.database();
	createCanvas(1000,400);
  
  dog = createSprite(250,300,20,20);
  dog.addImage(dogImage);
  dog.scale = 0.2;
 
  foodStock=database.ref('Food');
  foodStock.on("value", readStock);

  var dogPosition = database.ref("Food/position");
  dogPosition.on("value", readStock);
 
  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  })

  readState=database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  })

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodObj = new Food();

}


function draw() {  
  background(46,139,87);
  foodObj.display();
  
  currentTime=hour();
  if(currentTime===(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime===(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry");
    foodObj.display(); 
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  drawSprites();

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dogHappy);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
  })
  FeedTime:hour(), gameState:"Hungry"
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
   database.ref('/').update({
     gameState: state
   })
}



