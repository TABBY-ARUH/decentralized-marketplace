import { AccountIdentifier } from "@dfinity/nns";

export async function transferICP(sellerAddress, amount, memo) {
    const canister = await window.getLedgerCanister();
    const account = AccountIdentifier.fromHex(sellerAddress);
    const result = await canister.transfer({
        to: account.toUint8Array(),
        amount: { e8s: BigInt(amount) },
        memo,
        fee: { e8s: 10000n },
        from_subaccount: [],
        created_at_time: []
    });
    return result.Ok;
}

export async function balance() {
    const canister = await window.getLedgerCanister();
    const address = await window.getMarketplaceCanister().getAddressFromPrincipal(window.auth.principal);
    const balance = await canister.account_balance_dfx({ account: address });
    return (balance?.e8s / BigInt(10 ** 8)).toString();
}
