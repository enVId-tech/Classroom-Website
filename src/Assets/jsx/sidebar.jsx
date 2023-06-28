import React from 'react';
import '../css/sidebar.css'
import LoadInStudentData from './LoadInStudentData';

const Sidebar = () => {

    return (
        <section className='sidebar' id='sidebar'>
            <div className='sidebardiv' id='sidebardiv'>
                <LoadInStudentData />
            </div>
            <div id='Credits'>
                <h1 id='ComputerScience'>Computer Science Pathway | <a id='FooterName'
                    href='https://www.mrwai.com'>
                    MrWai.com
                </a>
                </h1>
                <h2 id='Copyright'>(Unofficial) Copyright 2010-2023; All rights reserved.</h2>
            </div>
        </section>
    );
}

export default Sidebar;
