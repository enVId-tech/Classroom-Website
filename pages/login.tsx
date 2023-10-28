import React from "react";

const Login: React.FC = (): JSX.Element => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [error, setError] = React.useState<string>("");
    
    const handleLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        try {
            setIsLoggedIn(true);
        } catch (error: unknown) {
            setError(error as string);
        }
    }

    React.useEffect((): void => {
        try {
            if (isLoggedIn) {
                window.location.href = "/";
            }
        } catch (error: unknown) {
            console.error(error as string);
        }
    }, [isLoggedIn]);

    const handleError = (error: string): void => {
        try {
            setError(error);

            setTimeout((): void => {
                setError("");
            }, 3000);
        } catch (error: unknown) {
            console.error(error as string);
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <p>{error}</p>
                <button type="submit">Login</button>
            </form>
        </div>
    )
};

export default Login;