import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import ActiveConnections from './pages/activeconnections.jsx';
import RequestConnections from './pages/requestconnections.jsx';
import ClassHome from './pages/classes/classhome.jsx';
import LearningLog from './pages/classes/learninglog.jsx';
import AssignmentList from './pages/classes/assignmentlist';
import Calendar from './pages/classes/agenda';

const PagesArray = [
    ["Profile", "Settings"],
    ["Connections", "View Appointments", "Request an Appointment"],
    [["CSD", "APCSP", "APCSA", "MAD"], "Announcements", "Assignments", "Calendar", "Console", "Learning Log"]
];

const PagesPathArray = [
    ["profile", "settings"],
    ["connections", "appointmentRequest", "appointmentView"],
    [["CSD", "APCSP", "APCSA", "MAD"], "announcements", "assignments", "calendar", "console", "learninglog"]
]


const Render = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/User/Authentication/*">
                    <Route path="Log-In/*" element={<Login />} />
                    <Route path="Log-Out/*" element={<LogOut />} />
                </Route>
                <Route path="/User/profile-settings/*">
                    <Route path={PagesPathArray[0][0]} element={<Profile Pages={PagesArray[0]} PagesArrayNumber={0} path={PagesPathArray[0]} />} />
                    <Route path={PagesPathArray[0][1]} element={<Settings Pages={PagesArray[0]} PagesArrayNumber={1} path={PagesPathArray[0]} />} />
                </Route>
                <Route path={PagesPathArray[1][0]} element={<Connections Pages={PagesArray[1]} PagesArrayNumber={0} path={PagesPathArray[1]} />}>
                    <Route path={PagesPathArray[1][1]} element={<ActiveConnections Pages={PagesArray[1]} PagesArrayNumber={1} path={PagesPathArray[2]} />} />
                    <Route path={PagesPathArray[1][2]} element={<RequestConnections />} />
                </Route>
                <Route path={`/Classes/${PagesPathArray[2][0][2]}/*`}>
                    <Route path="home/*" element={<ClassHome Pages={PagesArray[2]} PagesArrayNumber={0} ClassNum={2} />} />
                    <Route path="learninglog/*" element={<LearningLog Pages={PagesArray[5]} PagesArrayNumber={0} path={PagesArray[2][0][2]} />} />
                    <Route path="assignments/*" element={<AssignmentList Pages={PagesArray[2]} PagesArrayNumber={0} path={PagesArray[2][0][2]} />} />
                    <Route path="calendar/*" element={<Calendar Pages={PagesArray[3]} PagesArrayNumber={0} path={PagesArray[2][0][2]} />} />
                </Route>
                <Route path={`/Classes/${PagesPathArray[2][0][0]}/*`}>
                    <Route path="home/*" element={<ClassHome Pages={PagesArray[2]} PagesArrayNumber={0} ClassNum={0} />} />
                    <Route path="learninglog/*" element={<LearningLog Pages={PagesArray[5]} PagesArrayNumber={0} path={PagesArray[2][0][0]} />} />
                    <Route path="assignments/*" element={<AssignmentList Pages={PagesArray[2]} PagesArrayNumber={0} path={PagesArray[2][0][0]} />} />
                    <Route path="calendar/*" element={<Calendar Pages={PagesArray[3]} PagesArrayNumber={0} path={PagesArray[2][0][0]} />} />
                </Route>
                <Route path={`/Classes/${PagesPathArray[2][0][1]}/*`}>
                    <Route path="home/*" element={<ClassHome Pages={PagesArray[2]} PagesArrayNumber={0} ClassNum={1} />} />
                    <Route path={`learninglog/*`} element={<LearningLog Pages={PagesArray[5]} PagesArrayNumber={0} path={PagesArray[2][0][1]} />} />
                    <Route path={`assignments/*`} element={<AssignmentList Pages={PagesArray[2]} PagesArrayNumber={0} path={PagesArray[2][0][1]} />} />
                    <Route path={`calendar/*`} element={<Calendar Pages={PagesArray[3]} PagesArrayNumber={0} path={PagesArray[2][0][1]} />} />
                </Route>
                <Route path={`/Classes/${PagesPathArray[2][0][3]}/*`}>
                    <Route path="home/*" element={<ClassHome Pages={PagesArray[2]} PagesArrayNumber={0} ClassNum={3} />} />
                    <Route path={`learninglog/*`} element={<LearningLog Pages={PagesArray[5]} PagesArrayNumber={0} path={PagesArray[2][0][3]} />} />
                    <Route path={`assignments/*`} element={<AssignmentList Pages={PagesArray[2]} PagesArrayNumber={0} path={PagesArray[2][0][3]} />} />
                    <Route path={`calendar/*`} element={<Calendar Pages={PagesArray[3]} PagesArrayNumber={0} path={PagesArray[2][0][3]} />} />
                </Route>
            </Routes>
        </BrowserRouter>

    );
}

export default Render;