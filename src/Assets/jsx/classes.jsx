const Classes = (Pages) => {
    var pageTitle;
    var summary;

    switch (Pages) {
        case "CSD":
            pageTitle = "Computer Science Discoveries";
            summary =
                "Computer Science Discoveries (CSD) is an introductory computer science course available in the four pathways. It introduces basic programming skills through a series of creative projects and problems using the Code.org platform.";
            break;
        case "APCSP":
            pageTitle = "AP Computer Science Principles";
            summary =
                "AP Computer Science Principles (APCSP) is an AP course introducing the fundamentals of computer science, the internet, and programming, which is taught through the Code.org platform. You will do a variety of projects to learn and understand the basics of computer prorgramming, which will process into APCSA in which it will be used for practical applications. ";
            break;
        case "APCSA":
            pageTitle = "AP Computer Science A";
            summary =
                "AP Computer Science A (APCSA) is an intermediary AP course introducing more advanced concepts of computer science and programming through the Java programming language. You will learn advanced programming concepts such as object-oriented programming, data structures, and algorithms.";
            break;
        case "MAD":
            pageTitle = "Mobile Application Development";
            summary =
                "Mobile Application Development (MAD) is a course introducing the fundamentals of mobile application development through the development of projects and problems using the Android Studio platform, employing the techniques of Java programming through Visual Studio Code.";
            break;
        default:
            pageTitle = "";
            summary = "";
    }

    return {
        pageTitle,
        summary,
    };
};

export default Classes;
