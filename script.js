const chessBoard = document.getElementById('chessboard');
const boardSide = document.getElementById('side');
const boardBottom = document.getElementById('bottom');
let boardArr = [];
let piecesArr = [];
let helperArr = [8, 7, 6, 5, 4, 3, 2, 1, 0];
let swtich = false;
let possibleMoves = [];

function toLetters(num) {
    var mod = num % 26,
        pow = num / 26 | 0,
        out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? toLetters(pow) + out : out;
}

function createBoard(){
    for(let column = 8; column > 0; column--){
        let currColumnb = [];
        for (let row = 1; row < 9; row++){
            let tile = document.createElement('div');
            (row+column) % 2 === 0 ? tile.style.backgroundColor = "#769656" : tile.style.backgroundColor = "#eeeed2";   
            tile.classList.add('tile');
            tile.id = toLetters(row).toLowerCase() + column;
            tile.addEventListener('click', () => moveTo(tile));
            chessBoard.appendChild(tile);
            currColumnb.push(tile);
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
    e.stopPropagation()
    const pieceLocation = [Number(e.target.dataset.key.split('')[1]) - 1, e.target.dataset.key.split('')[0].charCodeAt(0) - 97];
    const piece = piecesArr[helperArr[pieceLocation[0] + 1]][pieceLocation[1]];
    swtich != false ? swtich[0] === piece[0] ? swtich = [piece[0], e.target] : moveTo(boardArr[helperArr[pieceLocation[0] + 1]][pieceLocation[1]]) : swtich = [piece[0], e.target];
    possibleMoves.forEach(possible => possible.classList.remove('possible'));
    possibleMoves = [];
    calcPossibleMoves(piece,pieceLocation);
    console.log(piece, swtich[1] ,pieceLocation);
}

function moveTo(tile){
    if(swtich != false){
        if(possibleMoves.includes(tile)){
            const pieceToFrom = piecesArr[helperArr[swtich[1].dataset.key.split('')[1]]][swtich[1].dataset.key.split('')[0].charCodeAt(0) - 97];
            const moveToTile = piecesArr[helperArr[tile.id.split('')[1]]][tile.id.split('')[0].charCodeAt(0) - 97];
            piecesArr[helperArr[tile.id.split('')[1]]][tile.id.split('')[0].charCodeAt(0) - 97] = pieceToFrom; 
            piecesArr[helperArr[swtich[1].dataset.key.split('')[1]]][swtich[1].dataset.key.split('')[0].charCodeAt(0) - 97] = moveToTile;
            swtich[1].parentNode.removeChild(swtich[1]);
            tile.appendChild(swtich[1]);
            swtich[1].dataset.key = tile.id;
            swtich = false;
            possibleMoves.forEach(possible => possible.classList.remove('possible'));
            possibleMoves = [];
        }
    }
}

function calcPossibleMoves(piece, pieceLocation){
    possibleMoves.forEach(possible => possible.classList.remove('possible'));
    possibleMoves = [];
    let side;
    piece[0] === 'w' ? side = 1 : side = -1;
    switch (piece[1]) {

        case 'p':

            let nextTile = boardArr[helperArr[pieceLocation[0]+1+(1 * side)]][pieceLocation[1]];
            let yummyTileLeft = boardArr[helperArr[pieceLocation[0]+1+(1 * side)]][pieceLocation[1]-1];
            let yummyTileRight = boardArr[helperArr[pieceLocation[0]+1+(1 * side)]][pieceLocation[1]+1];
            if(yummyTileLeft && yummyTileLeft.childNodes.length > 0 && yummyTileLeft.childNodes[0].alt.split('')[0] !== piece[0]){
                yummyTileLeft.classList.add('possible');
                possibleMoves.push(yummyTileLeft);
            } 
            if (yummyTileRight && yummyTileRight.childNodes.length > 0 && yummyTileRight.childNodes[0].alt.split('')[0] !== piece[0]){
                yummyTileRight.classList.add('possible');
                possibleMoves.push(yummyTileRight);
            }

            if(pieceLocation[0] * side === 1 || pieceLocation[0] * side === -6){
                for(let i = 1; i < 3; i++){
                    let currTile = boardArr[helperArr[pieceLocation[0]+1+(i*side)]][pieceLocation[1]];
                    if(currTile.childNodes.length === 0){
                        currTile.classList.add('possible');
                        possibleMoves.push(currTile);
                    } else {
                        i = 3;
                    }
                }
            } else { 
                console.log(yummyTileLeft,yummyTileRight)
                if(nextTile.childNodes.length === 0){
                    nextTile.classList.add('possible');
                    possibleMoves.push(nextTile);
                }

            }

            break;

        case 'R':
            
            for(let i = 0; i < 7; i++){
                if(!boardArr[helperArr[pieceLocation[0]+1+ i+1]]){                   
                    i = 8;
                    break;
                }
                let currTile = boardArr[helperArr[pieceLocation[0]+1+ i+1]][pieceLocation[1]];
                console.log(currTile)
                if(currTile.childNodes.length === 0){
                    currTile.classList.add('possible');
                    possibleMoves.push(currTile);
                } else if(currTile.childNodes[0].alt.split('')[0] !== piece[0]){
                    currTile.classList.add('possible');
                    possibleMoves.push(currTile);
                    i = 8;
                } else {
                    i = 8;
                }
            }
            
            for(let i = 0; i < 7; i++){
                if(!boardArr[helperArr[pieceLocation[0]-1-i+1]]){                   
                    i = 8;
                    break;
                }
                let currTile = boardArr[helperArr[pieceLocation[0]-1 - i + 1]][pieceLocation[1]];
                if(currTile.childNodes.length === 0){
                    currTile.classList.add('possible');
                    possibleMoves.push(currTile);
                } else if(currTile.childNodes[0].alt.split('')[0] !== piece[0]){
                    currTile.classList.add('possible');
                    possibleMoves.push(currTile);
                    i = 8;
                } else {
                    i = 8;
                }
            }

            for(let i = 0; i < 7; i++){
                 if(!boardArr[helperArr[pieceLocation[0]+ 1]][pieceLocation[1] + i + 1]){                   
                    i = 8;
                    break;
                }
                let currTile = boardArr[helperArr[pieceLocation[0]+ 1]][pieceLocation[1] + i + 1];
                if(currTile.childNodes.length === 0){
                    currTile.classList.add('possible');
                    possibleMoves.push(currTile);
                } else if(currTile.childNodes[0].alt.split('')[0] !== piece[0]){
                    currTile.classList.add('possible');
                    possibleMoves.push(currTile);
                    i = 8;
                } else {
                    i = 8;
                } 
            }

            for(let i = 0; i < 7; i++){
                if(!boardArr[helperArr[pieceLocation[0]+ 1]][pieceLocation[1] - i - 1]){                   
                   i = 8;
                   break;
               }
               let currTile = boardArr[helperArr[pieceLocation[0]+ 1]][pieceLocation[1] - i - 1];
               if(currTile.childNodes.length === 0){
                   currTile.classList.add('possible');
                   possibleMoves.push(currTile);
               } else if(currTile.childNodes[0].alt.split('')[0] !== piece[0]){
                   currTile.classList.add('possible');
                   possibleMoves.push(currTile);
                   i = 8;
               } else {
                   i = 8;
               } 
           }

            break;

        case 'N':
           
           let y = 2;
           let x = 1;
           for(let i = 0, j = 1; i < 8; j++, i++){
                let newY = x * -1 + -Math.floor(j/5);
                x = y - Math.floor(j/5)
                y = newY;
                j > 4 ? j = -1 : '';
                if((pieceLocation[0]+ 1 + x) <= -1 || (pieceLocation[0]+ 1 + x) >= 8 || (pieceLocation[1] - y) <= -1 || (pieceLocation[1] - y) >= 8){
                    console.log(y,x);
                } else {
                    let currTile = boardArr[helperArr[pieceLocation[0]+ 1 + x]][pieceLocation[1] - y];
                    console.log( y, x);
                    
                    if(currTile.childNodes.length === 0){
                        currTile.classList.add('possible');
                        possibleMoves.push(currTile);
                    } else if(currTile.childNodes[0].alt.split('')[0] !== piece[0]){
                        currTile.classList.add('possible');
                        possibleMoves.push(currTile);
                    }
                }
                
           }

            break;

        case 'B':
        
            break;

        case 'Q':
        
            break;

        case 'K':
        
            break;

        default:
            break;
    }
}

createBoard()
drawPieces()

