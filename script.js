const chessBoard = document.getElementById('chessboard');
const boardSide = document.getElementById('side');
const boardBottom = document.getElementById('bottom');
let boardArr = [];
let piecesArr = [];
let helperArr = [8, 7, 6, 5, 4, 3, 2, 1, 0];

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
        let side = document.createElement('p');
        let bottom = document.createElement('p');
        side.innerHTML = column;
        bottom.innerHTML = toLetters(column - 9 + 2 * boardArr.length).toLowerCase();
        column % 2 === 1 ? side.style.color = "#eeeed2" : side.style.color = "#769656"; 
        column % 2 !== 1 ? bottom.style.color = "#eeeed2" : bottom.style.color = "#769656";  
        boardSide.appendChild(side);
        boardBottom.appendChild(bottom);
    }
    let w = 'w';
    let b = 'b';
    piecesArr = [
        [[b,'R'],[b,'N'],[b,'B'],[b,'Q'],[b,'K'],[b,'B'],[b,'N'],[b,'R']],
        [[b,'p'],[b,'p'],[b,'p'],[b,'p'],[b,'p'],[b,'p'],[b,'p'],[b,'p']],
        [[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-']],
        [[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-']],
        [[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-']],
        [[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-'],[null,'-']],
        [[w,'p'],[w,'p'],[w,'p'],[w,'p'],[w,'p'],[w,'p'],[w,'p'],[w,'p']],
        [[w,'R'],[w,'N'],[w,'B'],[w,'Q'],[w,'K'],[w,'B'],[w,'N'],[w,'R']]
    ]
}

function drawPieces(){
    for(let column = 8, j = 0; column > 0, j < 8 ; column--, j++){
        for(let row = 1, i = 0; row <= 8, i < 8 ; row++, i++){
            let currSquare = document.getElementById(toLetters(row).toLowerCase() + column);
            piecesArr[j][i][0] != null ? currSquare.innerHTML=`<img onclick="${piecesArr[j][i][1]}Move(this)" data-key="${currSquare.id}" alt="${piecesArr[j][i][0]+piecesArr[j][i][1]}" src="./assets/${piecesArr[j][i][0]+piecesArr[j][i][1]}.png"></img>` : null;
        }
    }
}

function pMove(e){
    console.log(piecesArr[helperArr[e.dataset.key.split('')[1]]][e.dataset.key.split('')[0].charCodeAt(0) - 97])
}

function RMove(e){
    console.log(piecesArr[helperArr[e.dataset.key.split('')[1]]][e.dataset.key.split('')[0].charCodeAt(0) - 97])
}

function NMove(e){
    console.log(piecesArr[helperArr[e.dataset.key.split('')[1]]][e.dataset.key.split('')[0].charCodeAt(0) - 97])
}

function BMove(e){
    console.log(piecesArr[helperArr[e.dataset.key.split('')[1]]][e.dataset.key.split('')[0].charCodeAt(0) - 97])
}

function KMove(e){
    console.log(piecesArr[helperArr[e.dataset.key.split('')[1]]][e.dataset.key.split('')[0].charCodeAt(0) - 97])
}

function QMove(e){
    console.log(piecesArr[helperArr[e.dataset.key.split('')[1]]][e.dataset.key.split('')[0].charCodeAt(0) - 97])
}  

createBoard()
drawPieces()

