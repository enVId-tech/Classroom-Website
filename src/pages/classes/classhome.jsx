import React from "react";
import { Helmet } from "react-helmet";

import Sidebar from "../../Assets/jsx/sidebar";
import SelectionBar from "../../Assets/jsx/selectionbar";
import Classes from "../../Assets/jsx/classes";
import { LoggedOut, checkLoggedIn } from "../../Assets/jsx/keeploggedout";
import "../../Assets/images/CodeorgLogo.png";

const ClassHome = ({ Pages, PagesArrayNumber, path, ClassNum }) => {
  const { pageTitle, summary } = Classes(Pages[0][ClassNum]);

  return (
    <>
      <Helmet>
        <link rel="icon" href="../../Assets/images/CodeorgLogo.png" type="image/png" />
      </Helmet>
      <div className="connections">
        <Sidebar />
        <section className="content">
          <center>
            <h1 id="NamePlate">{pageTitle}</h1>
            <ul className="nav nav-tabs" role="tablist">
              <SelectionBar props={Pages} propActiveNumber={PagesArrayNumber} pageName={path} classNum={ClassNum} />
            </ul>
            <br /><br />
            <h1>{summary} <br /><br /><br /><br /> Feel free to explore MrWai.com to find any resources that may help you.</h1>
          </center>
        </section>
      </div>
    </>
  );
};

export default ClassHome;
