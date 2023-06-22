import React from "react";
import Sidebar from "../Assets/jsx/sidebar";
import HomepageContent from "../Assets/jsx/homecontent";

const Homepage = () => {
    return (
        <div className='home'>
            <Sidebar />
            <center>
                <HomepageContent />
            </center>
        </div>
    );
}

export default Homepage;