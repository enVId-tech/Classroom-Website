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
import ActiveConnections from './pages/appointmentRequest.jsx';
import RequestConnections from './pages/appointmentView.jsx';
import ClassHome from './pages/classes/classhome.jsx';
import LearningLog from './pages/classes/learninglog.jsx';
import AssignmentList from './pages/classes/assignmentlist';
import Calendar from './pages/classes/agenda';
import Announcements from './pages/classes/announcements';

const Render = () => {
    const PagesArray = [
        ["Profile", "Settings"],
        ["Connections", "View Appointments", "Request an Appointment"],
        [["CSD", "APCSP", "APCSA", "MAD"], "Announcements", "Assignments", "Calendar", "Learning Log"]
    ];

    const PagesPathArray = [
        ["profile", "settings"],
        ["connections", "appointmentRequest", "appointmentView"],
        ["home", "announcements", "assignments", "calendar", "learninglog"]
    ]

    const CSD = {
        Pages: PagesArray[2],
        PagesArrayNumber: 0,
        ClassNum: 0,
        path: PagesPathArray[2]
    };

    const APCSP = {
        Pages: PagesArray[2],
        PagesArrayNumber: 0,
        ClassNum: 1,
        path: PagesPathArray[2]
    }

    const APCSA = {
        Pages: PagesArray[2],
        PagesArrayNumber: 0,
        ClassNum: 2,
        path: PagesPathArray[2]
    }

    const MAD = {
        Pages: PagesArray[2],
        PagesArrayNumber: 0,
        ClassNum: 3,
        path: PagesPathArray[2]
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Redirects */}
                <Route path="/*" element={<Navigate to="/" />} />
                <Route path={"/connections/*"} element={<Navigate to={"/connections/home"} />} />
                <Route path={"/connections/"} element={<Navigate to={"/connections/home"} />} />
                <Route path={`/Classes/${PagesArray[2][0][0]}/*`} element={<Navigate to={`/Classes/${PagesArray[2][0][0]}/home`} />} />
                <Route path={`/Classes/${PagesArray[2][0][1]}/*`} element={<Navigate to={`/Classes/${PagesArray[2][0][1]}/home`} />} />
                <Route path={`/Classes/${PagesArray[2][0][2]}/*`} element={<Navigate to={`/Classes/${PagesArray[2][0][2]}/home`} />} />
                <Route path={`/Classes/${PagesArray[2][0][3]}/*`} element={<Navigate to={`/Classes/${PagesArray[2][0][3]}/home`} />} />

                {/* Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/User/Authentication/*">
                    <Route path="Log-In/*" element={<Login />} />
                    <Route path="Log-Out/*" element={<LogOut />} />
                </Route>
                <Route path="/User/profile-settings/*">
                    <Route path={PagesPathArray[0][0]} element={<Profile Pages={PagesArray[0]} PagesArrayNumber={0} path={PagesPathArray[0]} />} />
                    <Route path={PagesPathArray[0][1]} element={<Settings Pages={PagesArray[0]} PagesArrayNumber={1} path={PagesPathArray[0]} />} />
                </Route>
                <Route path={PagesPathArray[1][0]}>
                    <Route path="home/*" element={<Connections Pages={PagesArray[1]} PagesArrayNumber={0} path={PagesPathArray[1]} />} />
                    <Route path={PagesPathArray[1][1]} element={<ActiveConnections Pages={PagesArray[1]} PagesArrayNumber={1} path={PagesPathArray[2]} />} />
                    <Route path={PagesPathArray[1][2]} element={<RequestConnections />} />
                </Route>

                {/* Classes */}
                <Route path={`/Classes/${PagesArray[2][0][0]}/*`}>
                    <Route path="home/*" element={<ClassHome {...CSD} />} />
                    <Route path="learninglog/*" element={<LearningLog {...CSD} />} />
                    <Route path="assignments/*" element={<AssignmentList {...CSD} />} />
                    <Route path="calendar/*" element={<Calendar {...CSD} />} />
                    <Route path="announcements/*" element={<Announcements {...CSD} />} />
                </Route>

                <Route path={`/Classes/${PagesArray[2][0][1]}/*`}>
                    <Route path="home/*" element={<ClassHome {...APCSP} />} />
                    <Route path="learninglog/*" element={<LearningLog {...APCSP} />} />
                    <Route path="assignments/*" element={<AssignmentList {...APCSP} />} />
                    <Route path="calendar/*" element={<Calendar {...APCSP} />} />
                    <Route path="announcements/*" element={<Announcements {...APCSP} />} />
                </Route>

                <Route path={`/Classes/${PagesArray[2][0][2]}/*`}>
                    <Route path="home/*" element={<ClassHome {...APCSA} />} />
                    <Route path="learninglog/*" element={<LearningLog {...APCSA} />} />
                    <Route path="assignments/*" element={<AssignmentList {...APCSA} />} />
                    <Route path="calendar/*" element={<Calendar {...APCSA} />} />
                    <Route path="announcements/*" element={<Announcements {...APCSA} />} />
                </Route>

                <Route path={`/Classes/${PagesArray[2][0][3]}/*`}>
                    <Route path="home/*" element={<ClassHome {...MAD} />} />
                    <Route path={`learninglog/*`} element={<LearningLog {...MAD}/>} />
                    <Route path={`assignments/*`} element={<AssignmentList {...MAD} />} />
                    <Route path={`calendar/*`} element={<Calendar {...MAD} />} />
                    <Route path={`announcements/*`} element={<Announcements {...MAD} />} />
                </Route>
            </Routes>
        </BrowserRouter>


    );
}

export default Render;