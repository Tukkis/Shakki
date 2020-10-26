const chessBoard = document.getElementById('chessboard');
const boardSide = document.getElementById('side');
const boardBottom = document.getElementById('bottom');
let boardArr = [];
let piecesArr = [];

function toLetters(num) {
    var mod = num % 26,
        pow = num / 26 | 0,
        out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? toLetters(pow) + out : out;
}

function createBoard(){
    for(let column = 8; column > 0; column--){
        let currColumnb = [];
        let currColumnp = [];
        for (let row = 1; row < 9; row++){
            currColumnb.push(toLetters(row).toLowerCase() + column);
            currColumnp.push('-');
            let tile = document.createElement('div');
            (row+column) % 2 === 0 ? tile.style.backgroundColor = "#769656" : tile.style.backgroundColor = "#eeeed2";   
            tile.classList.add('tile');
            tile.id = toLetters(row).toLowerCase() + column;
            chessBoard.appendChild(tile);
        }
        boardArr.push(currColumnb);
        piecesArr.push(currColumnp);
        let side = document.createElement('p');
        let bottom = document.createElement('p');
        side.innerHTML = column;
        bottom.innerHTML = toLetters(column - 9 + 2 * boardArr.length).toLowerCase();
        column % 2 === 1 ? side.style.color = "#eeeed2" : side.style.color = "#769656";  
        boardSide.appendChild(side);
        boardBottom.appendChild(bottom);
    }
    console.log(boardArr);
}

createBoard()

