import React from 'react';
import '../css/sidebar.css'

const Sidebar = () => {
    return (
        <section className='sidebar' id='sidebar'>
            <div className='sidebardiv' id='sidebardiv'>
                <div className='sidebar-item'>
                    <div className='img' id='LeftImg'>
                        <img id='ProfilePicture' src='/' className='image' referrerPolicy='no-referrer' alt='../Assets/images/AdminI' />
                        <br />
                        <h4 id='Loggedinas'>Logged in as<br />'Placeholder'</h4>
                    </div>
                </div>
                <div className='sidebar-item'>
                    <button className='sidebar-label' onClick={() => window.location.replace("/")}>Home</button>
                </div>
                <div className='sidebar-item'>
                    <button className='sidebar-label' onClick={() => window.location.replace("/connections")}>Connections</button>
                    <div className='sidebar-dropdown'>
                        <div className='sidebar-item extras'>
                            <button className='sidebar-item extras' onClick={() => window.location.replace("/connections/appointmentView")}>View Appointments</button>
                        </div>
                        <div className='siderbar-item extras'>
                            <button className='sidebar-item extras' onClick={() => window.location.replace("/connections/appointmentRequest")}>Schedule an appointment</button>
                        </div>
                    </div>
                </div>
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
