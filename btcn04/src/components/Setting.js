import React from 'react';

export default class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            row: 10,
            col: 10
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <div>
                <label>Row: </label>
                <input defaultValue={10} name="row" onChange={(e) => this.handleChange(e)}/>
                <label>Column: </label>
                <input defaultValue={10} name="col" onChange={(e) => this.handleChange(e)}/>
                <button onClick={(row, col) => this.props.handleRestartGame(this.state.row, this.state.col)}>Restart Game</button>
            </div>
        )
    }
}