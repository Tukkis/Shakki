const chessBoard = document.getElementById('chessboard');
const boardSide = document.getElementById('side');
const boardBottom = document.getElementById('bottom');
let boardArr = [];
let piecesArr = [];
let helperArr = [8, 7, 6, 5, 4, 3, 2, 1, 0];
let swtich = false;

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
            tile.addEventListener('click', () => moveTo(tile));
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
            piecesArr[j][i][0] != null ? currSquare.innerHTML=`<img onclick="move(event)" data-key="${currSquare.id}" alt="${piecesArr[j][i][0]+piecesArr[j][i][1]}" src="./assets/${piecesArr[j][i][0]+piecesArr[j][i][1]}.png"></img>` : null;
        }
    }
}

function move(e){
    const piece = piecesArr[helperArr[e.target.dataset.key.split('')[1]]][e.target.dataset.key.split('')[0].charCodeAt(0) - 97];
    e.stopPropagation()
    swtich != false ? swtich[0] === piece[0] ? swtich = [piece[0], e.target] : console.log('nam') : swtich = [piece[0], e.target];
    console.log(piece, swtich[1]);
}

function moveTo(tile){
    if(swtich != false){
        swtich[1].parentNode.removeChild(swtich[1]);
        tile.appendChild(swtich[1]);
        swtich = false;
    }
    console.log(tile);
}

createBoard()
drawPieces()

