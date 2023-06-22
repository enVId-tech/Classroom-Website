import React from 'react';

const SelectionBar = ({ props, propActiveNumber, windowpath }) => {
    console.log({ props, propActiveNumber, windowpath })
    for (let i = 0; i < props.length; i++) {
        if (props[i] === 0) {
            return (
                <li className="nav-item">
                    <button className="nav-link enabled" id={props[i][propActiveNumber] + "-tab"} onClick={() => { window.location.replace(window.location.pathname + "./" + props[i]); }}>
                        {props[i][propActiveNumber]}
                    </button>
                </li>
            );
        } else {
            return (
                <li className="nav-item">
                    <button className="nav-link" onClick={() => window.location.replace("./" + props[i])}>
                        {props[i][propActiveNumber]}
                    </button>
                </li>
            );
        }
    }
};

export default SelectionBar;
