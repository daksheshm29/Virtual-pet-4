var dog,sadDog,happyDog,deadDog,garden, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;
var bedroom,washroom,garden;
var hour;

function preload(){ 
deadDog=loadImage("Images/deadDog.png")  
sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happydog.png");
garden=loadImage("Images/garden.png");
bedroom=loadImage("Images/bedroom.png");
washroom=loadImage("Images/washroom.png");
garden=loadImage("Images/garden.png");


}

function setup() {
  database=firebase.database();
  createCanvas(800,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  //read gamestate from firebase
  readState=database.ref('gamestate');
  readState.on("value",function(data){
    gameState=data.val();
  })
}

function draw() {
  textSize(15);

  if(lastFed>=12){
      text("Last Feed : "+ lastFed%12 + " PM", 50,30);
  }else if(lastFed==0){
      text("Last Feed : 12 AM",50,30);
  }else{
      text("Last Feed : "+ lastFed + " AM", 50,30);
  }
  var x=70,y=100; 
  imageMode(CENTER);
  if(this.foodStock!=0){
  for(var i=0;i<this.foodStock;i++){
    if(i%10==0){
      x=70;
      y=y+50;
    }
    image(this.image,x,y,50,50);
    x=x+30;
  }
}


  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
    // dog.addImage(happyDog);
   }
   else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
   drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  });
}

async function getTime(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Singapore");
  var responseJSON = await response.json();

  var datetime = responseJSON.datetime;
   hour = datetime.slice(11,13);
}
