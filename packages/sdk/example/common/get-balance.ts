import { createRaribleSdk } from "@rarible/sdk"
import { toUnionAddress } from "@rarible/types"
import type { BlockchainWallet } from "@rarible/sdk-wallet/src"
import type { AssetType } from "@rarible/api-client"

async function getBalance(wallet: BlockchainWallet, assetType: AssetType) {
	const sdk = createRaribleSdk(wallet, "dev")
	const balance = await sdk.balances.getBalance(
		toUnionAddress("<YOUR_WALLET_ADDRESS>"),
		assetType
	)
	return balance
}
