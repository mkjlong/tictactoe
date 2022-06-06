const turnimg = document.querySelector("#turn-img");
const gameEndText = document.querySelector("#game-end-text");
const botButton = document.querySelector("#bot-btn");
const board = new Board();
const page = new Page();


const depth = 6;

var botIsMoving = false;

$(".game-tile").on("click",function(){
    if(botIsMoving)return;
    const cell = +this.id.slice(-1);
    if(page.bot){
        board.move(cell, board.player)
        botIsMoving=true;
        setTimeout(function(){
            board.move(board.bestMove(0,depth),'o') 
            botIsMoving = false;
        },1000)
    }else{
        board.move(cell, board.player)
    }
    page.load();
})





$("#reset-btn")[0].addEventListener("click",()=>{board.reset()});
document.body.addEventListener("keyup", function(e) {
    if(/^(Space|r)$/.test(e.code)){
        board.reset();
    }
})
document.querySelector("#bot-btn").addEventListener("click",()=>{
    page.toggleBot();
    board.reset();
})
window.addEventListener('click', function(e){
    if(board.winner().winner && this.document.querySelector('main').contains(e.target) && this.document.querySelector("#game-end").contains(e.target))board.reset;
});