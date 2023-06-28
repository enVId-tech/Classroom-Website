import React from 'react';

const SelectionBar = ({ props, propActiveNumber, pageName, classNum }) => {
    const elements = [];

    for (let i = 0; i < props.length; i++) {
        if (i === propActiveNumber) {
            if (i === 0 && Array.isArray(props[i])) {
                elements.push(
                    <li className="nav-item" key={i}>
                        <button className="nav-link enabled" id={props[propActiveNumber][classNum] + "-tab"} onClick={() => {
                            const currentPath = window.location.pathname;
                            const newPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
                            window.location.replace(newPath + '/' + pageName[i]);
                        }}>
                            {props[propActiveNumber][classNum]}
                        </button>
                    </li>
                );
            } else {
                elements.push(
                    <li className="nav-item" key={i}>
                        <button className="nav-link enabled" id={props[propActiveNumber] + "-tab"} onClick={() => {
                            const currentPath = window.location.pathname;
                            const newPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
                            window.location.replace(newPath + '/' + pageName[i]);
                        }}>
                            {props[propActiveNumber]}
                        </button>
                    </li>
                );
            }
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

    return elements; // Return the array of elements
};

export default SelectionBar;
