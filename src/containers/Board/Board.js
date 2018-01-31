import React, { Component } from 'react';
import Row from './Row/Row';
import './Board.css';

class Board extends Component {
    state = {
        pause: true,
        width: 20,
        height: 20,
        turn: 0,
        cells: {},
        speed: 1000,
        mobile: false,
        square: true
    }

    progress = null;

    clickCellHandler = (event, row, col, val) => {
        clearTimeout(this.progress);
        let newCells = {...this.state.cells};
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
        let width = this.state.width;
        let height = this.state.height;
        for (let i = 1; i <= height; i++) {
            newCells[i] = {};
            for (let n = 1; n <= width; n++) {
                let x = 0;
                let above = i - 1;
                if (i === 1){
                    above = height;
                }
                let below = i + 1;
                if (i === height){
                    below = 1;
                }
                let left = n - 1;
                if (n === 1){
                    left = width;
                }
                let right = n + 1;
                if (n === width){
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
                if(this.state.cells[i][n] !== 'off'){
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

    speedChangeHandler = (event) => {
        clearTimeout(this.progress);
        this.setState({speed: event.target.value});
        if (this.state.pause === false){
            return this.progress = setInterval(this.start, event.target.value);
        }
    }

    sizeChangeHandler = (height, width) => {
        let initCells = {};
        let square = true; 
        if ( height !== width) {
            square = false;
        }
        for (let i = 1; i <= height; i++) {
            initCells[i] = {};
            for (let n = 1; n <= width; n++) {
                initCells[i][n] = 'off'
            }
        }
        clearTimeout(this.progress);
        return this.setState({cells: initCells, height: height, width: width, pause: true, turn: 0, square: square});
    }

    randomize = () => {
        let initCells = {};
        for (let i = 1; i <= this.state.height; i++) {
            initCells[i] = {};
            for (let n = 1; n <= this.state.width; n++) {
                let roll = Math.floor(Math.random() * (7-1)) + 1;
                initCells[i][n] = roll !== 1 ? 'off' : 'on';
            }
        }
        this.setState({cells: initCells, pause: false, turn: 0});
        return this.progress = setInterval(this.start, this.state.speed);
        
    }
    
    componentWillMount() {
            if (window.innerWidth < 550 || window.innerHeight < 550) { 
                this.setState({ mobile: true, height: 20, width: 20 });
            }
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
            <div className='Container'>
                <div className='Board' 
                 style={this.state.square 
                            ? this.state.mobile
                                ? {width: '180px'}
                                : {width: '650px'}
                            : this.state.mobile
                                ? {width: '250px'}
                                : {width: '900px'}
                       }
                >
                    {grid}
                </div>
                <div className='Counter'
                 style={this.state.square 
                            ? this.state.mobile
                                ? {width: '180px'}
                                : {width: '650px'}
                            : this.state.mobile
                                ? {width: '250px'}
                                : {width: '900px'}
                       }
                >
                    generation: {this.state.turn}
                </div>
                <div className='Controls'>
                    {this.state.pause 
                        ?  <button className='Start' onClick={this.pauseHandler} >START</button>
                        :  <button className='Start' onClick={this.pauseHandler} >PAUSE</button>
                    }
                    <div className='Size'>
                    {this.state.width === 120 && this.state.height === 80
                        ? <button onClick={(size) => this.sizeChangeHandler(80, 120)} disabled={this.state.mobile} >CLEAR </button>
                        : <button onClick={(size) => this.sizeChangeHandler(80, 120)} disabled={this.state.mobile} > 80x120 </button>
                    }
                    {this.state.width === 70 && this.state.height === 50
                        ? <button onClick={(size) => this.sizeChangeHandler(50, 70)} disabled={this.state.mobile} >CLEAR </button>
                        : <button onClick={(size) => this.sizeChangeHandler(50, 70)} disabled={this.state.mobile} > 50x70 </button>
                    }
                    {this.state.width === 50 && this.state.height === 30
                        ? <button onClick={(size) => this.sizeChangeHandler(30, 50)} disabled={this.state.mobile} >CLEAR </button>
                        : <button onClick={(size) => this.sizeChangeHandler(30, 50)} disabled={this.state.mobile} > 30x50 </button>
                    }
                    {this.state.width === 30 && this.state.height === 20
                        ? <button onClick={(size) => this.sizeChangeHandler(20, 30)} disabled={this.state.mobile} >CLEAR </button>
                        : <button onClick={(size) => this.sizeChangeHandler(20, 30)} disabled={this.state.mobile} > 20x30 </button>
                    }
                    {this.state.width === 20  && this.state.height === 20
                        ? <button onClick={(size) => this.sizeChangeHandler(20, 20)} >CLEAR </button>
                        : <button onClick={(size) => this.sizeChangeHandler(20, 20)} > 20x20 </button>
                    }
                    {this.state.width === 15  && this.state.height === 10
                        ? <button onClick={(size) => this.sizeChangeHandler(10, 15)} >CLEAR </button>
                        : <button onClick={(size) => this.sizeChangeHandler(10, 15)} > 10x15 </button>
                    }
                    {this.state.width === 10  && this.state.height === 10
                        ? <button onClick={(size) => this.sizeChangeHandler(10, 10)} >CLEAR </button>
                        : <button onClick={(size) => this.sizeChangeHandler(10, 10)} > 10x10 </button>
                    }
                    </div>
                    <button className='Randomizer' onClick={this.randomize} disabled={!this.state.pause} > randomize </button>
                    <select  className='Speed' defaultValue='800' onChange={(event) => this.speedChangeHandler(event)}> 
                        <option value='250'> turbo </option>
                        <option value='500'> fast </option>
                        <option value='800'> normal </option>
                        <option value='1200'> slow </option>
                    </select>
                </div>
            </div>
        );
    }
}

export default Board;
