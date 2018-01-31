import React from 'react';

const row = (props) => {
    
    let cells = Object.entries(props.row).map(col => {
        return (
            <div 
             className={(col[1] === 'off') 
                            ? 'Cell'
                            : (col[1] === 'old') 
                                ? 'Cell Old'
                                : 'Cell On'
                       }
             key={props.rowNum + ',' + col[0]}
             row={props.rowNum}
             col={col[0]}
             val={col[1]}
             onClick={(event, row, column, val) => { 
                props.click(event, props.rowNum, col[0], col[1])
                }
             } 
             />
        );
    });
    return (
        <div 
         className='Row'>
            {cells}
        </div>
    );
};

export default row;
