class Board{
    constructor(){
        this.default = {
            board:[" "," "," "," "," "," "," "," "," "],
            player:"x"
        }
        this.load();
        if(this.winner().winner){
            this.reset();
        }
    }
    reset(){
        //removes board, player from the localStorage
        ["board","player"].forEach(i=>localStorage.removeItem(i));
        //then loads to update the site
        this.load();
    }
    save(){
        localStorage.setItem("board", this.board.join(""));
        localStorage.setItem("player", this.player);
    }
    load(){
        //newArray = [...oldArray] copies the old array to the new array.
        this.board = localStorage.getItem("board")?localStorage.getItem("board").split(""):[...this.default.board];
        this.player = localStorage.getItem("player")||this.default.player;
        this.board.forEach((value, index) => {
            const element = document.querySelector(`#cell${index}`);
            if(/[xo]/.test(value)){
                element.classList.add(value)
                element.classList.remove(this.other(value));
            }else{
                element.classList.remove("x","o","disabled","winning-tile")
            }
        })
        turnimg.classList.add(`${this.player}-turn`);
        turnimg.classList.remove(`${this.player=="x"?"o":"x"}-turn`);
        if(this.winner().winner)this.end();
        else document.querySelector("#game-end").classList.remove("shown");
    }
    other(player){
        if(player == "x")return "o"
        if(player == "o")return "x"
    }
    end(){
        this.board.forEach((value,index)=>{
            $(`#cell${index}`)[0].classList.add("disabled");
        })
    }
    winner(){
        for(var arr of [
            [0,1,2],//horizontal
            [3,4,5],
            [6,7,8],
            [0,3,6],//vertical
            [1,4,7],
            [2,5,8],
            [0,4,8],//diagonal (top right, middle and bottom left)
            [2,4,6],//diagonal (top left, middle and bottom right)
        ]){
            if(this.board[arr[0]] == " ")continue;
            var winner = arr.every(a=>this.board[a]==this.board[arr[0]])
            if(winner){
                return {
                    winner: this.board[arr[0]],
                    arr: arr
                }
            }
        }
        if(this.board.filter(x=>/[xo]/.test(x)).length==9){
            return {
                winner: " ",
                arr: []
            }
        }
        else return false;
    }
    move(cell, player){
        //if the board is already full
        if(this.board.filter(x=>/[xo]/.test(x)).length==9)return;
        //if the cell is already occupied
        if(/[xo]/.test(this.board[cell]))return;
        //if there is already a winner or draw
        if(this.winner().winner)return;

        //places an x or o wherever they clicked
        this.board[cell]=player
        //switches player
        board.player = this.other(player);

        //saves, so if you reload the site, it stays the same.
        this.save();
        //loads to update the changes
        this.load();
    }
    log(){
        console.log(board.board.slice(0,3).join(""))
        console.log(board.board.slice(3,6).join(""))
        console.log(board.board.slice(6,9).join(""))
    }
    getAvailableMoves(){
        const avaliablemoves = []

        this.board.forEach((value, index)=>{
            if(value == " "){
                avaliablemoves.push(index);
            }
        })
        return avaliablemoves;
    }
    bestMove(depth=0,maxDepth=9){
        const minmax = this.player == "x" ? "max" : "min";
        const winner = false || this.winner().winner;
        if(winner && depth == 0){
            return null;
        }
        if(winner){
            if(winner == "x"){
                return 100-depth;
            }else if(winner == "o"){
                return depth-100;
            }else{
                return 0;
            }
        }
        if(depth == maxDepth)return 0;
        var move = -1;
        var score = 0;
        this.getAvailableMoves().forEach((index)=>{
            const childBoard = new Board();
            childBoard.board = JSON.parse(JSON.stringify(this.board));
            childBoard.board[index] = this.player;
            childBoard.player = this.other(this.player);
            var scoreForMove = childBoard.bestMove(depth+1, maxDepth);
            if(this.player == "x"){
                if(scoreForMove>score||move ==-1){
                    score = scoreForMove;
                    move = index
                }
            }else{
                if(scoreForMove<score||move ==-1){
                    score = scoreForMove;
                    move = index
                }
            }
        })
        if(depth == 0){
            return move;
        }
        return score;
    }
}