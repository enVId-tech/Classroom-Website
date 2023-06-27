import React from 'react';
import '../css/selectiontabs.css'

const SelectionBar = ({ props, propActiveNumber, pageName, classNum }) => {
    const elements = [];

    if ({classNum}) {
        for (let i = 0; i < props.length; i++) {
            if (i === 0 && Array.isArray(props[i])) {
                if (i === propActiveNumber) {
                    elements.push(
                        <li className="nav-item" key={i}>
                            <button className="nav-link enabled" id={props[0][classNum] + "-tab"} onClick={() => window.location.replace("./" + pageName[i])}>
                                {props[0][classNum]}
                            </button>
                        </li>
                    );
                } else {
                    elements.push(
                        <li className="nav-item" key={i}>
                            <button className="nav-link" onClick={() => window.location.replace("./" + pageName[i])}>
                                {props[0][classNum]}
                            </button>
                        </li>
                    );
                }
            } else {
                if (i === propActiveNumber) {
                    elements.push(
                        <li className="nav-item" key={i}>
                            <button className="nav-link enabled" id={props[propActiveNumber] + "-tab"} onClick={() => window.location.replace("./" + pageName[i])}>
                                {props[propActiveNumber]}
                            </button>
                        </li>
                    );
                } else {
                    elements.push(
                        <li className="nav-item" key={i}>
                            <button className="nav-link" onClick={() => window.location.replace("./" + pageName[i])}>
                                {props[i]}
                            </button>
                        </li>
                    );
                }
            }
        }

        return <ul className="nav nav-tabs" role="tablist">
            {elements}
        </ul>; // Return the array of elements
    } else {
        for (let i = 0; i < props.length; i++) {
            if (i === propActiveNumber) {
                elements.push(
                    <li className="nav-item" key={i}>
                        <button className="nav-link enabled" id={props[propActiveNumber] + "-tab"} onClick={() => window.location.replace("./" + pageName[i])}>
                            {props[propActiveNumber]}
                        </button>
                    </li>
                );
            } else {
                elements.push(
                    <li className="nav-item" key={i}>
                        <button className="nav-link" onClick={() => window.location.replace("./" + pageName[i])}>
                            {props[i]}
                        </button>
                    </li>
                );
            }
        }

        return <ul className="nav nav-tabs" role="tablist">
            {elements}
        </ul>; // Return the array of elements
    }
};

export default SelectionBar;
