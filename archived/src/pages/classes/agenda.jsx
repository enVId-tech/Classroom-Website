import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

import Sidebar from '../../Assets/jsx/sidebar';
import SelectionBar from '../../Assets/jsx/selectionbar';
import CreateCalendar from '../../Assets/jsx/createCalendar';
import ClassHelmet from '../../Assets/jsx/pagehead';
import '../../Assets/css/calendar.css';
import '../../Assets/images/CodeorgLogo.png'

// eslint-disable-next-line react/prop-types
function Calendar({ Pages, PagesArrayNumber, path, ClassNum }) {

  const ClassTitle = {
    page: "class",
    classType: Pages[0][ClassNum],
    classPage: "agenda"
  }

  return (
    <HelmetProvider>
      <ClassHelmet {...ClassTitle} />
      <div className="agenda">
        <Sidebar />
        <section className="content">
          <center>
            <h1 id="NamePlate">{Pages[0][ClassNum]} | Agenda</h1>
            <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} classNum={ClassNum} />
            <br />
            <CreateCalendar />
          </center>
        </section>
      </div>
    </HelmetProvider>
  );
}

export default Calendar;