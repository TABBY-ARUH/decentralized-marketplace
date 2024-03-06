import React, { useEffect, useCallback, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import Products from "./components/marketplace/Products";
import "./App.css";
import Wallet from "./components/Wallet";
import coverImg from "./assets/img/sandwich.jpg";
import { login, logout as destroy } from "./utils/auth";
import { balance as principalBalance } from "./utils/ledger";
import Cover from "./components/utils/Cover";
import { Notification } from "./components/utils/Notifications";

// Define the main App component
const App = function AppWrapper() {
    // Retrieve authentication status and principal information from window.auth
    const isAuthenticated = window.auth.isAuthenticated;
    const principal = window.auth.principalText;

    // Define state for balance and function to fetch balance
    const [balance, setBalance] = useState("0");

    // Function to fetch balance from ledger canister
    const getBalance = useCallback(async () => {
        // Check if user is authenticated before fetching balance
        if (isAuthenticated) {
            // Fetch balance and update state
            setBalance(await principalBalance());
        }
    });

    // Effect hook to fetch balance when component mounts or when getBalance function changes
    useEffect(() => {
        getBalance();
    }, [getBalance]);

    return (
        <>
            {/* Render notification component */}
            <Notification />

            {/* Conditional rendering based on authentication status */}
            {isAuthenticated ? (
                // If authenticated, render wallet and products
                <Container fluid="md">
                    <Nav className="justify-content-end pt-3 pb-5">
                        <Nav.Item>
                            {/* Render wallet component with principal and balance */}
                            <Wallet
                                principal={principal}
                                balance={balance}
                                symbol={"ICP"}
                                isAuthenticated={isAuthenticated}
                                destroy={destroy}
                            />
                        </Nav.Item>
                    </Nav>
                    <main>
                        {/* Render products component */}
                        <Products />
                    </main>
                </Container>
            ) : (
                // If not authenticated, render cover image and login button
                <Cover name="Street Food" login={login} coverImg={coverImg} />
            )}
        </>
    );
};

export default App;
