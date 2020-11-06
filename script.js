const chessBoard = document.getElementById('chessboard');
const boardSide = document.getElementById('side');
const boardBottom = document.getElementById('bottom');
const flipButton = document.getElementById('flipbutton');
const flipBoardBottom = document.getElementById('flipbottom');
const flipBoardSide = document.getElementById('flipside');
let moveAudio = new Audio('./assets/move.wav');
let boardArr = [];
let piecesArr = [];
let helperArr = [8, 7, 6, 5, 4, 3, 2, 1, 0];
let swtich = false;
let possibleMoves = [];
let checkedSquares = [];
let player = 'w';
let enPassant = [];
let checked = false;


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
            tile.addEventListener('click', () => moveTo(tile, false));
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
        let flipSide = document.createElement('p');
        let flipBottom = document.createElement('p');
        flipSide.innerHTML = helperArr[column] + 1;
        flipBottom.innerHTML = toLetters(column).toLowerCase();
        column % 2 === 1 ? flipSide.style.color = "#eeeed2" : flipSide.style.color = "#769656"; 
        column % 2 !== 1 ? flipBottom.style.color = "#eeeed2" : flipBottom.style.color = "#769656";  
        flipBoardSide.appendChild(flipSide);
        flipBoardBottom.appendChild(flipBottom);
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

function checkChecks(who){
    checkedSquares = [];
    who === 'w' ? who = 'b' : who = 'w';
    piecesArr.forEach((row,i) => {row.forEach((square,j) => {
        if(who===square[0]){
            console.log(square, helperArr[i+1], j)
            calcPossibleMoves(square,[helperArr[i+1], j],true)
        }
    })});
    checkedSquares.map(function(sqr){
        if(sqr.childNodes.length > 0 && sqr.childNodes[0].alt.split('')[1] === 'K'){
            checked = true;
        }
    })
}

function move(e){
    e.stopPropagation()
    const pieceLocation = [Number(e.target.dataset.key.split('')[1]) - 1, e.target.dataset.key.split('')[0].charCodeAt(0) - 97];
    const piece = piecesArr[helperArr[pieceLocation[0] + 1]][pieceLocation[1]];
    if(piece[0] === player){
        swtich != false ? swtich[0] === piece[0] ? swtich = [piece[0], e.target] : '' : swtich = [piece[0], e.target];
        possibleMoves.forEach(possible => possible.classList.remove('possible'));
        possibleMoves = [];
        calcPossibleMoves(piece,pieceLocation,false);
    } else {
        moveTo(boardArr[helperArr[pieceLocation[0] + 1]][pieceLocation[1]], true);
    }
}

function moveTo(tile, takes){
    if(swtich != false && tile.classList.contains('tile')){
        if(possibleMoves.includes(tile)){
            moveAudio.play()
            const pieceToFrom = piecesArr[helperArr[swtich[1].dataset.key.split('')[1]]][swtich[1].dataset.key.split('')[0].charCodeAt(0) - 97];
            const moveToTile = piecesArr[helperArr[tile.id.split('')[1]]][tile.id.split('')[0].charCodeAt(0) - 97];
            piecesArr[helperArr[tile.id.split('')[1]]][tile.id.split('')[0].charCodeAt(0) - 97] = pieceToFrom;
            !takes ? piecesArr[helperArr[swtich[1].dataset.key.split('')[1]]][swtich[1].dataset.key.split('')[0].charCodeAt(0) - 97] = moveToTile : piecesArr[helperArr[swtich[1].dataset.key.split('')[1]]][swtich[1].dataset.key.split('')[0].charCodeAt(0) - 97] = [null, '-'];
            swtich[1].parentNode.removeChild(swtich[1]);
            if(tile === enPassant[0] && swtich[1].alt.split('')[1] === 'p' && enPassant[1] !== player && tile !== enPassant[0]){
                let side = 0;
                enPassant[1] === 'w' ? side = 1 : side = -1;
                piecesArr[helperArr[Number(tile.id.split('')[1])+1*side]][tile.id.split('')[0].charCodeAt(0) - 97] = [null, '-'];
                boardArr[helperArr[Number(tile.id.split('')[1])+1*side]][tile.id.split('')[0].charCodeAt(0) - 97].removeChild(boardArr[helperArr[Number(tile.id.split('')[1])+1*side]][tile.id.split('')[0].charCodeAt(0) - 97].childNodes[0])
            }
            takes ? tile.removeChild(document.querySelector(`[data-key="${tile.id}"]`)) : '';
            tile.appendChild(swtich[1]);
            swtich[1].dataset.key = tile.id;
            swtich = false;
            possibleMoves.forEach(possible => possible.classList.remove('possible'));
            possibleMoves = [];
            enPassant[1] !== player ? enPassant = [] : '';
            player === 'w' ? player = 'b' : player = 'w';
            checkChecks(player);
        }
    }
}

function calcPossibleMoves(piece, pieceLocation, checkCalc){
    possibleMoves.forEach(possible => possible.classList.remove('possible'));
    possibleMoves = [];
    let side;
    player === 'w' ? side = 1 : side = -1;
    checkCalc ? side *= -1 : '';
    if(checked){
        piece = [player, 'K'];
        let kingLoc = document.querySelector(`[alt="${piece[0]}${piece[1]}"]`);
        swtich = [player, kingLoc];
        pieceLocation = [kingLoc.dataset.key.split('')[1]-1,kingLoc.dataset.key.split('')[0].charCodeAt(0) - 97];
    }
    switch (piece[1]) {

        case 'p':

            let nextTile = boardArr[helperArr[pieceLocation[0]+1+(1 * side)]][pieceLocation[1]];
            let yummyTileLeft = boardArr[helperArr[pieceLocation[0]+1+(1 * side)]][pieceLocation[1]-1];
            let yummyTileRight = boardArr[helperArr[pieceLocation[0]+1+(1 * side)]][pieceLocation[1]+1];
            if(yummyTileLeft && yummyTileLeft.childNodes.length > 0 && yummyTileLeft.childNodes[0].alt.split('')[0] !== piece[0] || (yummyTileLeft && yummyTileLeft === enPassant[0])){
                yummyTileLeft.classList.add('possible');
                possibleMoves.push(yummyTileLeft); 
            } else if (yummyTileLeft && yummyTileLeft.childNodes.length === 0 && checkCalc){
                possibleMoves.push(yummyTileLeft); 
            }
            if (yummyTileRight && yummyTileRight.childNodes.length > 0 && yummyTileRight.childNodes[0].alt.split('')[0] !== piece[0] || (yummyTileRight && yummyTileRight === enPassant[0])){
                yummyTileRight.classList.add('possible');
                possibleMoves.push(yummyTileRight);
            } else if (yummyTileRight && yummyTileRight.childNodes.length === 0 && checkCalc){
                possibleMoves.push(yummyTileRight);
            }
            if(pieceLocation[0] * side === 1 || pieceLocation[0] * side === -6){
                for(let i = 1; i < 3; i++){
                    let currTile = boardArr[helperArr[pieceLocation[0]+1+(i*side)]][pieceLocation[1]];
                    if(currTile.childNodes.length === 0){
                        if(!checkCalc){
                            currTile.classList.add('possible');
                            possibleMoves.push(currTile);
                            i === 1 ? enPassant = [currTile, player, pieceLocation[0] + 2 * side, pieceLocation[1]]: '';
                        }
                    } else {
                        i = 3;
                    }
                }
            } else { 
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
                if((pieceLocation[0]+ x) <= -1 || (pieceLocation[0]+ 1 + x) >= 8 || (pieceLocation[1] - y) <= -1 || (pieceLocation[1] - y) >= 8){
                } else {
                    let currTile = boardArr[helperArr[pieceLocation[0]+ 1 + x]][pieceLocation[1] - y];
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
        
            for(let i = 0; i < 7; i++){
                if(!((pieceLocation[0] + 1 + i + 1) >= 0 && (pieceLocation[0] + 1 + i + 1) <= 8 && (pieceLocation[1] + i + 1) >= 0 && (pieceLocation[1] + i + 1) <= 7)){                   
                    i = 8;
                    break;
                }
                let currTile = boardArr[helperArr[pieceLocation[0]+1+ i+1]][pieceLocation[1] + 1 + i];
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
                if(!((pieceLocation[0] + 1 + i + 1) >= 0 && (pieceLocation[0] + 1 + i + 1) <= 8 && (pieceLocation[1] - i - 1) >= 0 && (pieceLocation[1] - i - 1) <= 7)){                   
                    i = 8;
                    break;
                }
                let currTile = boardArr[helperArr[pieceLocation[0] + 1 + i + 1]][pieceLocation[1] - i - 1];
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
                 if(!((pieceLocation[0] + 1 - i - 1) > 0 && (pieceLocation[0] + 1 - i - 1) <= 8 && (pieceLocation[1] - i - 1) >= 0 && (pieceLocation[1] - i - 1) <= 7)){                   
                    i = 8;
                    break;
                }
                let currTile = boardArr[helperArr[pieceLocation[0] + 1 - i - 1]][pieceLocation[1] - i - 1];
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
                if(!((pieceLocation[0] + 1 - i - 1) > 0 && (pieceLocation[0] + 1 - i - 1) <= 8 && (pieceLocation[1] + i + 1) >= 0 && (pieceLocation[1] + i + 1) <= 7)){                   
                   i = 8;
                   break;
               }    
               let currTile = boardArr[helperArr[pieceLocation[0] + 1 - i - 1]][pieceLocation[1] + i + 1];
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

        case 'Q':
        
            for(let i = 0; i < 7; i++){
                if(!((pieceLocation[0] + 1 + i + 1) >= 0 && (pieceLocation[0] + 1 + i + 1) <= 8 && (pieceLocation[1] + i + 1) >= 0 && (pieceLocation[1] + i + 1) <= 7)){                   
                    i = 8;
                    break;
                }
                let currTile = boardArr[helperArr[pieceLocation[0]+1+ i+1]][pieceLocation[1] + 1 + i];
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
                if(!((pieceLocation[0] + 1 + i + 1) >= 0 && (pieceLocation[0] + 1 + i + 1) <= 8 && (pieceLocation[1] - i - 1) >= 0 && (pieceLocation[1] - i - 1) <= 7)){                   
                    i = 8;
                    break;
                }
                let currTile = boardArr[helperArr[pieceLocation[0] + 1 + i + 1]][pieceLocation[1] - i - 1];
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
                 if(!((pieceLocation[0] + 1 - i - 1) > 0 && (pieceLocation[0] + 1 - i - 1) <= 8 && (pieceLocation[1] - i - 1) >= 0 && (pieceLocation[1] - i - 1) <= 7)){                   
                    i = 8;
                    break;
                }
                let currTile = boardArr[helperArr[pieceLocation[0] + 1 - i - 1]][pieceLocation[1] - i - 1];
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
                if(!((pieceLocation[0] + 1 - i - 1) > 0 && (pieceLocation[0] + 1 - i - 1) <= 8 && (pieceLocation[1] + i + 1) >= 0 && (pieceLocation[1] + i + 1) <= 7)){                   
                   i = 8;
                   break;
               }    
               let currTile = boardArr[helperArr[pieceLocation[0] + 1 - i - 1]][pieceLocation[1] + i + 1];
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
            if(!boardArr[helperArr[pieceLocation[0]+1+ i+1]]){                   
                i = 8;
                break;
            }
            let currTile = boardArr[helperArr[pieceLocation[0]+1+ i+1]][pieceLocation[1]];
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

        case 'K':
            
            let a = 1;
            let b = 0;
            for(let i = 0, j = 1; i <= 7; i++, j++){
                
                if((pieceLocation[0]+ a) <= -1 || (pieceLocation[0]+ 1 + a) >= 8 || (pieceLocation[1] - b) <= -1 || (pieceLocation[1] - b) >= 8){
                } else {
                    let currTile = boardArr[helperArr[pieceLocation[0]+ 1 + a]][pieceLocation[1] - b];
                    if(currTile.childNodes.length === 0 && !checkedSquares.includes(currTile)){
                        currTile.classList.add('possible');
                        possibleMoves.push(currTile);
                    } else if(currTile.childNodes.length > 0 && currTile.childNodes[0].alt.split('')[0] !== piece[0] && !checkedSquares.includes(currTile)){
                        currTile.classList.add('possible');
                        possibleMoves.push(currTile);
                    }
                }
                let newA = b * -1;
                b = a + 1 * Math.floor(j/4);
                a = newA;
                j > 3 ? j = -1 : '';
            }

            break;

        default:
            break;
    }
    if(checkCalc){
        possibleMoves.forEach(sqr => checkedSquares.includes(sqr) ? sqr : checkedSquares.push(sqr))
        possibleMoves.forEach(possible => possible.classList.remove('possible'));;
        possibleMoves = [];
    }
    checked = false;
}

createBoard()
drawPieces()


flipBoardSide.offsetLeft = boardSide.offsetLeft;
flipBoardSide.offsetTop = boardSide.offsetTop;
flipBoardBottom.offsetLeft = boardBottom.offsetLeft;
flipBoardBottom.offsetTop = boardBottom.offsetTop;

flipButton.addEventListener('click', function(){
    chessBoard.classList.toggle('flip');
    boardArr.forEach(row => row.forEach(cell => cell.classList.toggle('flip')));
    boardSide.classList.toggle('displayer');
    flipBoardSide.classList.toggle('displayer');
    boardBottom.classList.toggle('displayer');
    flipBoardBottom.classList.toggle('displayer');
})