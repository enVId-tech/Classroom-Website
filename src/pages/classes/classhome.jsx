import React from "react";
import { HelmetProvider } from "react-helmet-async";

import Sidebar from "../../Assets/jsx/sidebar";
import SelectionBar from "../../Assets/jsx/selectionbar";
import Classes from "../../Assets/jsx/classes";
import ClassHelmet from "../../Assets/jsx/pagehead";
import "../../Assets/images/CodeorgLogo.png";

// eslint-disable-next-line react/prop-types
const ClassHome = ({ Pages, PagesArrayNumber, path, ClassNum }) => {
  const { pageTitle, summary } = Classes(Pages[0][ClassNum]);

  const ClassTitle = {
    page: "class",
    classType: Pages[0][ClassNum],
    classPage: "home"
  }

  return (
    <HelmetProvider>
      <ClassHelmet {...ClassTitle} />
      <div className="connections">
        <Sidebar />
        <section className="content">
          <center>
            <h1 id="NamePlate">{pageTitle}</h1>
            <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} classNum={ClassNum} />
            <br /><br />
            <h1>{summary} <br /><br /><br /><br /> Feel free to explore the website to find any resources that may assist you.</h1>
          </center>
        </section>
      </div>
    </HelmetProvider>
  );
};

export default ClassHome;
