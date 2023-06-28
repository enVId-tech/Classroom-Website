import React from "react";
import Sidebar from "../Assets/jsx/sidebar";
import HomepageContent from "../Assets/jsx/homecontent";
import { HelmetProvider } from "react-helmet-async";
import ClassHelmet from "../Assets/jsx/pagehead";

const Homepage = () => {
    return (
        <HelmetProvider>
            <ClassHelmet page="home" />
            <div className='home'>
                <Sidebar />
                <center>
                    <HomepageContent />
                </center>
            </div>
        </HelmetProvider>
    );
}

export default Homepage;