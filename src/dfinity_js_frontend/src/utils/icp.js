import { getMarketplaceCanister, getLedgerCanister } from "./canisterFactory";
import { getAuthClient } from "./auth";

export async function initializeContract() {
    try {
        const authClient = await getAuthClient();
        window.auth = {};
        window.canister = {};
        window.auth.client = authClient;
        window.auth.isAuthenticated = await authClient.isAuthenticated();
        window.auth.identity = authClient.getIdentity();
        window.auth.principal = authClient.getIdentity()?.getPrincipal();
        window.auth.principalText = authClient.getIdentity()?.getPrincipal().toText();
        window.canister.marketplace = await getMarketplaceCanister();
        window.canister.ledger = await getLedgerCanister();
    } catch (error) {
        console.error("Error initializing contract:", error);
        throw error;
    }
}
