import React from "react";

const LogOut = () => {
    return (
        <div>
            <center>
                <div class="LoginContainer">
                    <span id="BackgroundImage">
                        <br /><br /><br />
                        <h1 id="CopyrightedMaterial">© MrWai.com</h1>
                    </span>
                    <br /><br />
                    <h1 id="LogoutTitle">You have been logged out!</h1>
                    <br /><br />
                    <button id="LoginButton" onclick="window.location.replace('/User/Authentication/Log-In');">Return to Login Page</button>
                </div>
            </center>
            <script>
                {
                    window.onload = () => {
                        document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                        if (document.cookie.includes("dataID")) {
                            document.cookie = "dataID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                        }
                    }
                }
            </script>
        </div>
    )
}

export default LogOut;