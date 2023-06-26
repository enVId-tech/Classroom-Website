import React from 'react';
import { Helmet } from 'react-helmet';

import Sidebar from '../../Assets/jsx/sidebar';
import SelectionBar from '../../Assets/jsx/selectionbar';
import '../../Assets/css/calendar.css';
import '../../Assets/images/CodeorgLogo.png'

function Calendar({ Pages, PagesArrayNumber, path, ClassNum }) {

  return (
    <>
      <Helmet>
        <link rel="icon" href="../../Assets/images/CodeorgLogo.png" type="image/png" />
      </Helmet>
      <div className="connections">
        <Sidebar />
        <section className="content">
          <center>
            <h1 id="NamePlate">{Pages[0][ClassNum]} | Agenda</h1>
            <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} classNum={ClassNum} />
            <br />
            <div className="slider">
              <div className="slider-tabs">{ }</div>
              <div className="slider-content">{ }</div>
            </div>
          </center>
        </section>
      </div>
    </>
  );
}

export default Calendar;