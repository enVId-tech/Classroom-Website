import React from "react";
import styles from '../styles/home.module.scss';

const Home: React.FC = (): JSX.Element => {
    const [confirmedLoginInfo, setConfirmedLoginInfo] = React.useState(false);

    React.useEffect((): void => {
        try {
            setConfirmedLoginInfo(false);
        } catch (error: unknown) {
            console.error(error as string);
        }
    }, []);

    React.useEffect((): void => {
        try {
            if (!confirmedLoginInfo) {
                window.location.href = "/login";
            }
        } catch (error: unknown) {
            console.error(error as string);
        }
    }, [confirmedLoginInfo]);

    return (
        <>
            {
                confirmedLoginInfo ? (
                    <div className={styles.container}>
                        <h1>Home</h1>
                    </div>
                ) : (
                    <></>
                )
            }

        </>
    )
}

export default Home;