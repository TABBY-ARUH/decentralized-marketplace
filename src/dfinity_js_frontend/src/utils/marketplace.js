import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

export async function createProduct(product) {
    const marketplaceCanister = await window.getMarketplaceCanister();
    return marketplaceCanister.addProduct(product);
}

export async function getProducts() {
    try {
        const marketplaceCanister = await window.getMarketplaceCanister();
        return await marketplaceCanister.getProducts();
    } catch (err) {
        if (err.name === "AgentHTTPResponseError") {
            const authClient = window.auth.client;
            await authClient.logout();
        }
        return [];
    }
}

export async function buyProduct(product) {
    try {
        const marketplaceCanister = await window.getMarketplaceCanister();
        const orderResponse = await marketplaceCanister.createOrder(product.id);
        const sellerPrincipal = Principal.from(orderResponse.Ok.seller);
        const sellerAddress = await marketplaceCanister.getAddressFromPrincipal(sellerPrincipal);
        const block = await transferICP(sellerAddress, orderResponse.Ok.price, orderResponse.Ok.memo);
        await marketplaceCanister.completePurchase(sellerPrincipal, product.id, orderResponse.Ok.price, block, orderResponse.Ok.memo);
    } catch (error) {
        console.error("Error buying product:", error);
        throw error;
    }
}
