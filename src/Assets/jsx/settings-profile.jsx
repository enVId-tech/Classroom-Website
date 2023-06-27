import React from 'react';

const User = ({type}) => {
    if (type === "settings") {
        return (
            <div id="Settings">
                <h1 id="firstName">
                    First Name: <input type="text" id="firstn" name="username" value="Placeholder" disabled />
                </h1>
                <br />
                <h1 id="lastName">
                    Last Name: <input type="text" id="lastn" name="username" value="Placeholder" disabled />
                </h1>
                <br />
                <h2 id="Email">
                    Email: <input type="text" id="email" name="username" value="Placeholder" disabled />
                </h2>
                <br />
                <br />
                <h2 id="userName">
                    Username: <input type="text" id="username" name="username" value="" disabled />
                </h2>
                <br />
                <h2 id="passWord">
                    Password: <input type="password" id="password" name="password" value="" />
                </h2>
                <br />
                <h2 id="passWordConfirm">
                    Confirm Password: <input type="password" id="passwordconfirm" name="passwordconfirm" value="" />
                </h2>
                <br /><br /><br /><br />
                <h1 id="Error"></h1>
                <button id="Save">
                    <h1 id="SaveLabel">Save</h1>
                </button>
            </div>
        )
    } else if (type === "profile") {
        return (
            <div id="Profile">
                <div id="ProfileSettings">
                    <br /><br /><br />
                    <span>
                        <h1>
                            <img class="profilepicture"></img>
                            <input type="text" id="display" class="display" name="display" value="" />
                        </h1>
                    </span>
                    <br /><br /><br /><br />
                    <h1 id="Error"></h1>
                    <button id="Save">
                        <h1 id="SaveLabel">Save</h1>
                    </button>
                </div>
            </div>
        )
    }
}

export default User;