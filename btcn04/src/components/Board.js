import React from 'react';

import Square from './SSquare';

export default class Board extends React.Component {

    renderSquare(iRow, iCol) {
        let isHighlight = false;
        if(this.props.winnerData &&
            this.props.winnerData.squareHighlights.find(function (location) {
                return location.iRow === iRow && location.iCol === iCol;
            })) {
            isHighlight = true;
        }
        return <Square
            key={(iRow+1)*(iCol+1)}
            isHighlight={isHighlight}
            value={this.props.squares[iRow][iCol]}
            onClick={() => this.props.onClick(iRow, iCol)}
        />;
    }

    createRow(iRow, numCol) {
        let itemRows = [];
        for(let iCol = 0; iCol < numCol; iCol++) {
            itemRows.push(this.renderSquare(iRow, iCol));
        }
        return (
            <div className="board-row" key={iRow}>
                {itemRows}
            </div>
        )
    }

    render() {
        const numRow = this.props.dimension.row;
        const numCol = this.props.dimension.col;
        let board = [];
        for(let iRow = 0; iRow < numRow; iRow++) {
            board.push(this.createRow(iRow, numCol));
        }
        return (
            <div>
                <div className="status">{this.props.status}</div>
                {board}
            </div>
        );
    }
}





















