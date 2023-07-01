import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// CSS
import './Assets/css/announcements.css';
import './Assets/css/assignments.css';
import './Assets/css/calendar.css';
import './Assets/css/console.css';
import './Assets/css/home.css';
import './Assets/css/learninglog.css';
import './Assets/css/log.css';
import './Assets/css/profile.css';
import './Assets/css/selectiontabs.css';
import './Assets/css/settings.css';
import './Assets/css/sidebar.css';
import './Assets/css/sidescrollbar.css';

//Pages
import HomePage from './pages/home.jsx';
import LogOut from './pages/logout.jsx';
import Login from './pages/login.jsx';
import Profile from './pages/profile.jsx';
import Settings from './pages/settings.jsx';
import Connections from './pages/connections.jsx';
import ActiveConnections from './pages/appointmentView.jsx';
import RequestConnections from './pages/appointmentRequest.jsx';
import ClassHome from './pages/classes/classhome.jsx';
import LearningLog from './pages/classes/learninglog.jsx';
import AssignmentList from './pages/classes/assignmentlist';
import Calendar from './pages/classes/agenda';
import Announcements from './pages/classes/announcements';
const Render = () => {
    const PagesArray = [
        ["Settings", "Profile"],
        ["Connections", "View Appointments", "Request an Appointment"],
        [["CSD", "APCSP", "APCSA", "MAD"], "Announcements", "Assignments", "Agenda", "Learning Log"]
    ];

    const PagesPathArray = [
        ["settings", "profile" ],
        ["connections", "appointmentRequest", "appointmentView"],
        ["home", "announcements", "assignments", "agenda", "learninglog"]
    ]

    const CSD = {
        Pages: PagesArray[2],
        ClassNum: 0,
        path: PagesPathArray[2]
    };

    const APCSP = {
        Pages: PagesArray[2],
        ClassNum: 1,
        path: PagesPathArray[2]
    }

    const APCSA = {
        Pages: PagesArray[2],
        ClassNum: 2,
        path: PagesPathArray[2]
    }

    const MAD = {
        Pages: PagesArray[2],
        ClassNum: 3,
        path: PagesPathArray[2]
    }

    const connectionsHomeCONST = {
        Pages: PagesArray[1],
        PagesArrayNumber: 0,
        path: PagesPathArray[1]
    }

    const appointmentViewCONST = {
        Pages: PagesArray[1],
        PagesArrayNumber: 1,
        path: PagesPathArray[1]
    }

    const appointmentRequestCONST = {
        Pages: PagesArray[1],
        PagesArrayNumber: 2,
        path: PagesPathArray[1]
    }

    const profile = {
        Pages: PagesArray[0],
        PagesArrayNumber: 1,
        path: PagesPathArray[0]
    }

    const settings = {
        Pages: PagesArray[0],
        PagesArrayNumber: 0,
        path: PagesPathArray[0]
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Redirects */}
                <Route path="/*" element={<Navigate to="/" />} />
                <Route path={"/connections/*"} element={<Navigate to={"/connections/home"} />} />
                <Route path={"/connections/"} element={<Navigate to={"/connections/home"} />} />
                <Route path={"/User/profile-settings/*"} element={<Navigate to={"/User/profile-settings/settings"} />} />
                <Route path={`${PagesPathArray[0][0]}/`} element={<Navigate to={`/User/profile-settings/${PagesPathArray[0][0]}`} />} />
                <Route path={`${PagesPathArray[0][1]}/`} element={<Navigate to={`/User/profile-settings/${PagesPathArray[0][1]}`} />} />
                <Route path={`/Classes/${PagesArray[2][0][0]}/*`} element={<Navigate to={`/Classes/${PagesArray[2][0][0]}/${PagesPathArray[2][0]}`} />} />
                <Route path={`/Classes/${PagesArray[2][0][1]}/*`} element={<Navigate to={`/Classes/${PagesArray[2][0][1]}/${PagesPathArray[2][0]}`} />} />
                <Route path={`/Classes/${PagesArray[2][0][2]}/*`} element={<Navigate to={`/Classes/${PagesArray[2][0][2]}/${PagesPathArray[2][0]}`} />} />
                <Route path={`/Classes/${PagesArray[2][0][3]}/*`} element={<Navigate to={`/Classes/${PagesArray[2][0][3]}/${PagesPathArray[2][0]}`} />} />

                {/* Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/User/Authentication/*">
                    <Route path="Log-In/*" element={<Login />} />
                    <Route path="Log-Out/*" element={<LogOut />} />
                </Route>
                <Route path="/User/profile-settings/*">
                    <Route path={PagesPathArray[0][0]} element={<Settings {...settings} />} />
                    <Route path={PagesPathArray[0][1]} element={<Profile {...profile} />} />
                </Route>
                <Route path={PagesPathArray[1][0]}>
                    <Route path="home/*" element={<Connections {...connectionsHomeCONST} />} />
                    <Route path={PagesPathArray[1][1]} element={<ActiveConnections {...appointmentViewCONST} />} />
                    <Route path={PagesPathArray[1][2]} element={<RequestConnections {...appointmentRequestCONST} />} />
                </Route>

                {/* Classes */}
                <Route path={`/Classes/${PagesArray[2][0][0]}/*`}>
                    <Route path={`${PagesPathArray[2][0]}`} element={<ClassHome {...CSD} PagesArrayNumber={0} />} />
                    <Route path={`${PagesPathArray[2][1]}`} element={<Announcements {...CSD} PagesArrayNumber={1} />} />
                    <Route path={`${PagesPathArray[2][2]}`} element={<AssignmentList {...CSD} PagesArrayNumber={2} />} />
                    <Route path={`${PagesPathArray[2][3]}`} element={<Calendar {...CSD} PagesArrayNumber={3} />} />
                    <Route path={`${PagesPathArray[2][4]}`} element={<LearningLog {...CSD} PagesArrayNumber={4} />} />
                </Route>

                <Route path={`/Classes/${PagesArray[2][0][1]}/*`}>
                    <Route path={`${PagesPathArray[2][0]}`} element={<ClassHome {...APCSP} PagesArrayNumber={0} />} />
                    <Route path={`${PagesPathArray[2][1]}`} element={<Announcements {...APCSP} PagesArrayNumber={1} />} />
                    <Route path={`${PagesPathArray[2][2]}`} element={<AssignmentList {...APCSP} PagesArrayNumber={2} />} />
                    <Route path={`${PagesPathArray[2][3]}`} element={<Calendar {...APCSP} PagesArrayNumber={3} />} />
                    <Route path={`${PagesPathArray[2][4]}`} element={<LearningLog {...APCSP} PagesArrayNumber={4} />} />
                </Route>

                <Route path={`/Classes/${PagesArray[2][0][2]}/*`}>
                    <Route path={`${PagesPathArray[2][0]}`} element={<ClassHome {...APCSA} PagesArrayNumber={0} />} />
                    <Route path={`${PagesPathArray[2][1]}`} element={<Announcements {...APCSA} PagesArrayNumber={1} />} />
                    <Route path={`${PagesPathArray[2][2]}`} element={<AssignmentList {...APCSA} PagesArrayNumber={2} />} />
                    <Route path={`${PagesPathArray[2][3]}`} element={<Calendar {...APCSA} PagesArrayNumber={3} />} />
                    <Route path={`${PagesPathArray[2][4]}`} element={<LearningLog {...APCSA} PagesArrayNumber={4} />} />
                </Route>

                <Route path={`/Classes/${PagesArray[2][0][3]}/*`}>
                    <Route path={`${PagesPathArray[2][0]}`} element={<ClassHome {...MAD} PagesArrayNumber={0} />} />
                    <Route path={`${PagesPathArray[2][1]}`} element={<Announcements {...MAD} PagesArrayNumber={1} />} />
                    <Route path={`${PagesPathArray[2][2]}`} element={<AssignmentList {...MAD} PagesArrayNumber={2} />} />
                    <Route path={`${PagesPathArray[2][3]}`} element={<Calendar {...MAD} PagesArrayNumber={3} />} />
                    <Route path={`${PagesPathArray[2][4]}`} element={<LearningLog {...MAD} PagesArrayNumber={4} />} />
                </Route>
            </Routes>
        </BrowserRouter>


    );
}

export default Render;