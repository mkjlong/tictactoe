

class Page{
    constructor(){
        this.bot = true;
        this.x = +localStorage.getItem("x")||0;
        this.o = +localStorage.getItem("o")||0;
        this.tie = +localStorage.getItem("tie")||0;
        this.load();
    }
    save(){
        localStorage.setItem("x",this.x);
        localStorage.setItem("o",this.o);
        localStorage.setItem("tie",this.tie);
        localStorage.setItem("bot", +this.bot+"");
    }
    load(){
        if(/[xo ]/.test(board.winner().winner)){
            this.end()
        };
        if(localStorage.getItem("x")){
            this.x = +localStorage.getItem("x")
            document.querySelector("#x-wincount-text").innerHTML=this.x;
        }
        if(localStorage.getItem("o")){
            this.o = +localStorage.getItem("o")
            document.querySelector("#o-wincount-text").innerHTML=this.o;
        }
        if(localStorage.getItem("tie")){
            this.tie = +localStorage.getItem("tie")
            document.querySelector("#tiecount-text").innerHTML=this.tie;
        }
        if(localStorage.getItem("bot")){
            this.bot = !!+localStorage.getItem("bot");
            if(this.bot)this.singleplayer();
            else this.multiplayer();
        }
        if(!board.winner().winner){
            document.querySelector("#game-end").classList.remove("shown");
        }
    }
    end(){
        if(board.winner().winner==undefined)throw new Error("No winner");
        gameEndText.innerHTML=board.winner().winner==" "?"NO WINNER":board.winner().winner.toUpperCase()+" WON"
        for(var i of board.winner().arr){
            $(`#cell${i}`)[0].classList.add("winning-tile");
        }
        if(board.winner().winner == "x")page.x++;
        else if(board.winner().winner == "o")page.o++;
        else page.tie++
        document.querySelector("#game-end").classList.add("shown");
        board.save();
        this.save();
    }
    multiplayer(){
        botButton.classList.remove("singleplayer")
        botButton.classList.add("multiplayer")
        botButton.innerHTML = "MULTIPLAYER"
        this.bot = false;
        this.save();
        
    }
    singleplayer(){
        botButton.classList.remove("multiplayer")
        botButton.classList.add("singleplayer")
        botButton.innerHTML = "SINGLEPLAYER"
        this.bot = true;
        this.save();
    }
    toggleBot(){
        if(page.bot)this.multiplayer();
        else this.singleplayer();
        board.reset();
    }
}