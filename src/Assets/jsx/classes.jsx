const Classes = (Pages) => {
    var pageTitle;
    var summary;

    switch (Pages) {
        case "CSD":
            pageTitle = "Computer Science Discoveries | Home";
            summary =
                "Computer Science Discoveries is an introductory computer science course available in the four pathways. It introduces basic programming skills through a series of creative projects and problems using the Code.org platform.";
            break;
        case "APCSP":
            pageTitle = "AP Computer Science Principles | Home";
            summary =
                "AP Computer Science Principles is an AP course introducing the fundamentals of computer science and programming through the development of projects and problems using the Code.org platform.";
            break;
        case "APCSA":
            pageTitle = "AP Computer Science A | Home";
            summary =
                "AP Computer Science A is an AP course introducing more advanced concepts of computer science and programming through the Java programming language. You will learn advanced programming concepts such as object-oriented programming, data structures, and algorithms.";
            break;
        case "MAD":
            pageTitle = "Mobile Application Development | Home";
            summary =
                "Mobile Application Development is a course introducing the fundamentals of mobile application development through the development of projects and problems using the Android Studio platform, employing the techniques of Java programming through Visual Studio Code.";
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
