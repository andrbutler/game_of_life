import React, { Component } from 'react';
import Row from './Row/Row';
import './Board.css';

class Board extends Component {
    state = {
        pause: true,
        size: 20,
        turn: 0,
        cells: {},
        speed: 1000,
    }

    progress = null;

    clickCellHandler = (event, row, col, val) => {
        clearTimeout(this.progress);
        let newCells = {...this.state.cells};
        console.log('row: ' + row);
        console.log('col: ' + col);
        console.log('val: ' + val);
        console.log('newCells: ' + newCells);
        if (val === 'off') {
            newCells[row][col] = 'on';
        } else {
            newCells[row][col] = 'off';
        }
        this.setState({cells: newCells});
        if (this.state.pause === false){
            return this.progress = setInterval(this.start, this.state.speed);
        }
    }

    start = () => {
        let next = this.state.turn + 1;
        let newCells = {};
        let cells = this.state.cells;
        let size = this.state.size;
        for (let i = 1; i <= size; i++) {
            newCells[i] = {};
            for (let n = 1; n <= size; n++) {
                let x = 0;
                let above = i - 1;
                if (i === 1){
                    above = size;
                }
                let below = i + 1;
                if (i === size){
                    below = 1;
                }
                let left = n - 1;
                if (n === 1){
                    left = size;
                }
                let right = n + 1;
                if (n === size){
                    right = 1;
                }
                let neighbors = [ 
                    cells[above][left],
                    cells[above][n],
                    cells[above][right],
                    cells[i][left],
                    cells[i][right],
                    cells[below][left],
                    cells[below][n],
                    cells[below][right],
                ];
                for (let y of neighbors) {
                    if (y !== 'off'){
                        x++;
                    }
                }
                if(this.state.cells[i][n] != 'off'){
                    if(x >= 2 && x <= 3){
                        newCells[i][n] = 'old';
                    } else {
                        newCells[i][n] = 'off';
                    }
                } else {
                    if (x !== 3) {
                        newCells[i][n] = 'off';
                    } else {
                        newCells[i][n] = 'on';
                    }
                }
            }
        }
        this.setState({turn: next, cells: newCells});
        if (JSON.stringify(newCells) === JSON.stringify(cells)) {
            this.pauseHandler();
        }
    }

    pauseHandler = () => {
        if (this.state.pause === true) {
            this.progress = setInterval(this.start, this.state.speed);
            this.setState({pause: false});
        } else {
            clearTimeout(this.progress);
            this.setState({pause: true});
        }
    }

    speedChangeHandler = (speed) => {
        clearTimeout(this.progress);
        this.setState({speed: speed});
        if (this.state.pause === false){
            return this.progress = setInterval(this.start, speed);
        }
    }

    sizeChangeHandler = (size) => {
        let initCells = {};
        for (let i = 1; i <= size; i++) {
            initCells[i] = {};
            for (let n = 1; n <= size; n++) {
                initCells[i][n] = 'off'
            }
        }
        clearTimeout(this.progress);
        return this.setState({cells: initCells, size: size, pause: true, turn: 0});
    }

    randomize = () => {
        let initCells = {};
        for (let i = 1; i <= this.state.size; i++) {
            initCells[i] = {};
            for (let n = 1; n <= this.state.size; n++) {
                let roll = Math.floor(Math.random() * (7-1)) + 1;
                console.log(roll);
                initCells[i][n] = roll !== 1 ? 'off' : 'on';
            }
        }
        this.setState({cells: initCells, pause: false, turn: 0});
        return this.progress = setInterval(this.start, this.state.speed);
        
    }
    
    componentWillMount() {
            return this.randomize();
    }

    render () {
        
        let grid = Object.keys(this.state.cells).map(row => {
            return (
                <Row 
                 key={row} 
                 rowNum={row}
                 row={this.state.cells[row]}
                 click={this.clickCellHandler}
                />
            );
        });


        return (
            <div>
                <div className='Counter'>
                    <h1>generation: {this.state.turn}</h1>
                </div>
                <div className='Board' >
                    {grid}
                </div>
                <div className='Controls'>
                    {this.state.pause 
                        ?  <button onClick={this.pauseHandler} >START</button>
                        :  <button onClick={this.pauseHandler} >PAUSE</button>
                    }
                    {this.state.size === 40 
                        ? <button onClick={(size) => this.sizeChangeHandler(40)} >CLEAR </button>
                        : <button onClick={(size) => this.sizeChangeHandler(40)} > 40x40 </button>
                    }
                    {this.state.size === 20 
                        ? <button onClick={(size) => this.sizeChangeHandler(20)} >CLEAR </button>
                        : <button onClick={(size) => this.sizeChangeHandler(20)} > 20x20 </button>
                    }
                    {this.state.size === 10 
                        ? <button onClick={(size) => this.sizeChangeHandler(10)} >CLEAR </button>
                        : <button onClick={(size) => this.sizeChangeHandler(10)} > 10x10 </button>
                    }
                    <button onClick={(speed) => this.speedChangeHandler(250)} > turbo </button>
                    <button onClick={(speed) => this.speedChangeHandler(500)} > fast </button>
                    <button onClick={(speed) => this.speedChangeHandler(800)} > normal </button>
                    <button onClick={(speed) => this.speedChangeHandler(1200)} > slow </button>
                    <button onClick={this.randomize} disabled={!this.state.pause} > randomize </button>
                </div>
            </div>
        );
    }
}

export default Board;
