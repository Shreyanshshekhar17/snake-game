const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");
const highScoreElement = document.querySelector("#high-score");
const timeElement = document.querySelector("#time");
const scoreElement = document.querySelector("#score");


const blockheight = 50;
const blockwidth = 50;

let highscore = localStorage.getItem("highscore") || 0;
let score = 0;
let time = `00:00`;

highScoreElement.innerText = highscore;

const cols = Math.floor(board.clientWidth / blockwidth);
const rows = Math.floor(board.clientHeight / blockheight);
let intervalId = null;
let timerIntervalId = null;
let food ={x:Math.floor(Math.random() * rows), y:Math.floor(Math.random() * cols)};


const blocks = {};
let snake = [{
    x:1,y:3
},{
    x:1,y:4
},{
    x:1,y:5
}]

let direction = "down";





for(let row = 0; row < rows; row++) {
    for(let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        // block.innerText = `${row}-${col}`;
        blocks[`${row}-${col}`] = block;
    }
}

function render(){
        let head = null;
       
        blocks[`${food.x}-${food.y}`].classList.add("food");

    if(direction === "left"){
        head = {
            x: snake[0].x,
            y: snake[0].y - 1
        }
    }else if(direction === "right"){
        head = {
            x: snake[0].x,
            y: snake[0].y + 1
        }
    }else if(direction === "up"){
        head = {x: snake[0].x - 1, y: snake[0].y}}
    else if(direction === "down")
        {head = {x: snake[0].x + 1, y: snake[0].y}}

// wall collision logic

if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
    clearInterval(intervalId);
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
}

//food consumed logic

if(head.x === food.x && head.y === food.y){
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
       x:Math.floor(Math.random() * rows), y:Math.floor(Math.random() * cols)
  }
     blocks[`${food.x}-${food.y}`].classList.add("food");

    snake.unshift(head);

    score+=10;
    scoreElement.innerText = score;

    if(score > highscore){
        highscore = score;
        localStorage.setItem("highscore", highscore.toString());
    }
}


    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    });
     snake.unshift(head);  
     snake.pop();
   snake.forEach(segment =>{
    blocks[`${segment.x}-${segment.y}`].classList.add("fill")
   })
}
render();

// intervalId = setInterval(() => {
//     render();
// }, 300);


startButton.addEventListener("click", () => {
    modal.style.display = "none";
    intervalId = setInterval(() => { render() }, 200)
    timerIntervalId = setInterval(() => {
        let [minutes, seconds] = time.split(":").map(Number);
        if(seconds === 59){
            minutes++;
            seconds = 0;
        }else{
            seconds++;
        }
        time = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeElement.innerText = time;
    }, 1000);
    });


restartButton.addEventListener("click", restartGame);


function restartGame(){

    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    });

    score = 0;
    time = `00:00`;

    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highscore;


    modal.style.display = "none";
    snake = [{
        x:1,y:3},{
        x:1,y:4},{
        x:1,y:5 }]
    food ={x:Math.floor(Math.random() * rows), y:Math.floor(Math.random() * cols)};
    intervalId = setInterval(() => { render() }, 200)
    direction = "down";
    
}




document.addEventListener("keydown",(event)=>{
    if(event.key === "ArrowUp" && direction !== "down"){
        direction = "up";
    }else if(event.key === "ArrowDown" && direction !== "up"){
        direction = "down";
    }else if(event.key === "ArrowLeft" && direction !== "right"){
        direction = "left";
    }else if(event.key === "ArrowRight" && direction !== "left"){
        direction = "right";
    }
})