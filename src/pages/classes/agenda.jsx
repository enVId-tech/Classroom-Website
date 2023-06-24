import React from 'react';
import Sidebar from '../../Assets/jsx/sidebar';
import SelectionBar from '../../Assets/jsx/selectionbar';
import '../../Assets/css/calendar.css';

function Calendar({ Pages, PagesArrayNumber, path, ClassNum }) {

  return (
    <div className="connections">
      <Sidebar />
      <section className="content">
        <center>
          <h1 id="NamePlate">{Pages[0][ClassNum]} | Agenda</h1>
          <ul className="nav nav-tabs" role="tablist">
            <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} classNum={ClassNum} />
          </ul>
          <br />
          <div className="slider">
            <div className="slider-tabs">{ }</div>
            <div className="slider-content">{ }</div>
          </div>
        </center>
      </section>
    </div>
  );
}

export default Calendar;