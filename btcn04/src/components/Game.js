import React from 'react';

import Board from './Board';
import Setting from "./Setting";

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dimension: {
                row: 10,
                col: 10
            },
            history: [
                {
                    squares: [...new Array(10)].map((e) => new Array(10).fill(null)),
                    currentMove: null,
                    winnerData: null
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            reverseHistory: false
        }
    }

    handleClick(iRow, iCol) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        let squares = [];
        for(let i = 0; i < current.squares.length; i++) {
            squares[i] = current.squares[i].slice();
        }
        if(current.winnerData || squares[iRow][iCol]) {
            return;
        }
        const currentMove = {
            iCol: iCol,
            iRow: iRow
        };
        squares[iRow][iCol] = this.state.xIsNext ? 'X' : 'O';
        const winnerData = calculateWinner(this.state.dimension, squares, currentMove);
        this.setState({
            history: [...history, {squares: squares, currentMove: currentMove, winnerData: winnerData}],
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    handleRestartGame(row, col) {
        row = parseInt(row, 10);
        col = parseInt(col, 10);
        if(!Number.isInteger(row)) {
            row = 10;
        }
        if(!Number.isInteger(col)) {
            col = 10;
        }
        this.setState({
            dimension: {
                row: row,
                col: col
            },
            history: [
                {
                    squares: [...new Array(Math.floor(row))].map((e) => new Array(Math.floor(col)).fill(null)),
                    currentMove: null,
                    winner: null
                }
            ],
            stepNumber: 0,
            xIsNext: true,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerData = current.winnerData;

        let moves = history.map((step, move) => {
            const currentMove = step.currentMove;
            let decs = move ?
                'Go to move #' + move + ' (' + currentMove.iCol + ',' + currentMove.iRow + ')':
                'Go to game start';
            if(move === this.state.stepNumber) {
                decs = <b>{decs}</b>
            }
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{decs}</button>
                </li>
            )
        });

        let textButton = "Tăng dần";
        if(this.state.reverseHistory) {
            moves.reverse();
            textButton = "Giảm dần";
        }

        let status;
        if(winnerData) {
            status = "Winner: " + winnerData.winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="setting-game">
                    <Setting handleRestartGame={(row, col) => this.handleRestartGame(row, col)}/>
                </div>
                <hr/>
                <div className="game-board">
                    <Board
                        winnerData={winnerData}
                        dimension={this.state.dimension}
                        squares={current.squares}
                        onClick={(iRow, iCol) => this.handleClick(iRow, iCol)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <hr />
                    <div style={{float: 'right', marginBottom: 10}}>
                        <button onClick={() => this.setState({reverseHistory: !this.state.reverseHistory})}>{textButton}</button>
                    </div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(dimension, squares, currentMove) {
    if(currentMove === null)
        return;

    const maxRow = dimension.row;
    const maxCol = dimension.col;
    const rowMove = currentMove.iRow;
    const colMove = currentMove.iCol;

    const signal = squares[rowMove][colMove];

    let count;
    let currentRowCheck;
    let currentColCheck;

    let squareHighlights = [];

    // Kiem tra hang doc
    count = 1;
    currentRowCheck = rowMove - 1;
    squareHighlights.push({iRow: rowMove, iCol: colMove});
    while(currentRowCheck >= 0 && squares[currentRowCheck][colMove] === signal) {
        squareHighlights.push({iRow: currentRowCheck, iCol: colMove});
        count++;
        if(count === 5) {
            return {
                winner: signal,
                squareHighlights: squareHighlights
            };
        }
        currentRowCheck--;
    }
    currentRowCheck = rowMove + 1;
    while(currentRowCheck < maxRow && squares[currentRowCheck][colMove] === signal) {
        squareHighlights.push({iRow: currentRowCheck, iCol: colMove});
        count++;
        if(count === 5) {
            return {
                winner: signal,
                squareHighlights: squareHighlights
            };
        }
        currentRowCheck++;
    }

    // Kiem tra hang ngang
    count = 1;
    currentColCheck = colMove - 1;
    squareHighlights = [];
    squareHighlights.push({iRow: rowMove, iCol: colMove});
    while(currentColCheck >= 0 && squares[rowMove][currentColCheck] === signal) {
        squareHighlights.push({iRow: rowMove, iCol: currentColCheck});
        count++;
        if(count === 5) {
            return {
                winner: signal,
                squareHighlights: squareHighlights
            };
        }
        currentColCheck--;
    }
    currentColCheck = colMove + 1;
    while(currentRowCheck < maxRow && squares[rowMove][currentColCheck] === signal) {
        squareHighlights.push({iRow: rowMove, iCol: currentColCheck});
        count++;
        if(count === 5) {
            return {
                winner: signal,
                squareHighlights: squareHighlights
            };
        }
        currentColCheck++;
    }

    // // Kiem tra duong cheo thuan
    count = 1;
    currentRowCheck = rowMove - 1;
    currentColCheck = colMove - 1;
    squareHighlights = [];
    squareHighlights.push({iRow: rowMove, iCol: colMove});
    while(currentRowCheck >= 0 && currentColCheck >= 0 &&
        squares[currentRowCheck][currentColCheck] === signal) {
        squareHighlights.push({iRow: currentRowCheck, iCol: currentColCheck});
        count++;
        if(count === 5) {
            return {
                winner: signal,
                squareHighlights: squareHighlights
            };
        }
        currentRowCheck--;
        currentColCheck--;
    }
    currentRowCheck = rowMove + 1;
    currentColCheck = colMove + 1;
    while(currentRowCheck < maxRow && currentColCheck < maxCol &&
        squares[currentRowCheck][currentColCheck] === signal) {
        squareHighlights.push({iRow: currentRowCheck, iCol: currentColCheck});
        count++;
        if(count === 5) {
            return {
                winner: signal,
                squareHighlights: squareHighlights
            };
        }
        currentRowCheck++;
        currentColCheck++;
    }

    // Kiem tra duong cheo nghich
    count = 1;
    currentRowCheck = rowMove + 1;
    currentColCheck = colMove - 1;
    squareHighlights = [];
    squareHighlights.push({iRow: rowMove, iCol: colMove});
    while(currentRowCheck < maxRow && currentColCheck >= 0 &&
    squares[currentRowCheck][currentColCheck] === signal) {
        squareHighlights.push({iRow: currentRowCheck, iCol: currentColCheck});
        count++;
        if(count === 5) {
            return {
                winner: signal,
                squareHighlights: squareHighlights
            };
        }
        currentRowCheck++;
        currentColCheck--;
    }
    currentRowCheck = rowMove - 1;
    currentColCheck = colMove + 1;
    while(currentRowCheck >= 0 && currentColCheck < maxCol &&
    squares[currentRowCheck][currentColCheck] === signal) {
        squareHighlights.push({iRow: currentRowCheck, iCol: currentColCheck});
        count++;
        if(count === 5) {
            return {
                winner: signal,
                squareHighlights: squareHighlights
            };
        }
        currentRowCheck--;
        currentColCheck++;
    }

    return null;
}




















