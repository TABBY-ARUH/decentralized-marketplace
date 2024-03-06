import { AuthClient } from "@dfinity/auth-client";
import { useState, useEffect } from "react";

// URL of the webapp for the Internet Identity.
const IDENTITY_PROVIDER = `http://localhost:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai#authorize`;

// Maximum time to live for authentication in nanoseconds.
const MAX_TTL = 7 * 24 * 60 * 60 * 1000 * 1000 * 1000;

// Function to create an instance of the AuthClient.
export async function getAuthClient() {
    return await AuthClient.create();
}

// Custom hook to handle authentication state.
export function useAuthentication() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            const authClient = await getAuthClient();
            const authenticated = await authClient.isAuthenticated();
            setIsAuthenticated(authenticated);
        };

        checkAuthentication();
    }, []);

    return isAuthenticated;
}

// Function to initiate the user login process.
export async function login() {
    const authClient = await getAuthClient();
    const isAuthenticated = await authClient.isAuthenticated();

    if (!isAuthenticated) {
        await authClient?.login({
            identityProvider: IDENTITY_PROVIDER,
            onSuccess: async () => {
                window.location.reload(); // Reload the page upon successful login
            },
            maxTimeToLive: MAX_TTL,
        });
    }
}

// Function to log the user out.
export async function logout() {
    const authClient = await getAuthClient();
    authClient.logout();
    window.location.reload(); // Reload the page to reflect the logged-out state
}
