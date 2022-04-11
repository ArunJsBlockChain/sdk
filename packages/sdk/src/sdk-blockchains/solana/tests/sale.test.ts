import { SolanaWallet } from "@rarible/sdk-wallet"
import { toBigNumber, toCollectionId } from "@rarible/types"
import { createRaribleSdk } from "../../../index"
import { LogsLevel } from "../../../domain"
import { getWallet } from "../common/test/test-wallets"
import { MintType } from "../../../types/nft/mint/domain"
import { retry } from "../../../common/retry"

describe("Solana sell", () => {
	const wallet = getWallet(0)
	const buyerWallet = getWallet(1)
	const sdk = createRaribleSdk(new SolanaWallet(wallet), "dev", {
		logs: LogsLevel.DISABLED,
		blockchain: {
			"SOLANA": {
				auctionHouseMapping: {
					"SOLANA_SOL": {  // native sol
						address: "8Qu3azqi31VpgPwVW99AyiBGnLSpookWQiwLMvFn4NFm",
						baseFee: 1000,
					},
				},
			},
		},
	})

	const buyerSdk = createRaribleSdk(new SolanaWallet(buyerWallet), "dev", {
		logs: LogsLevel.DISABLED,
		blockchain: {
			"SOLANA": {
				auctionHouseMapping: {
					"SOLANA_SOL": {  // native sol
						address: "8Qu3azqi31VpgPwVW99AyiBGnLSpookWQiwLMvFn4NFm",
						baseFee: 1000,
					},
				},
			},
		},
	})
	test("Should sell NFT item", async () => {
		const mint = await sdk.nft.mint({
			collectionId: toCollectionId("SOLANA:65DNtgn5enhi6QXevn64jFq41Qgv71bvr8UVVwGiYkLJ"),
		})

		const mintRes = await mint.submit({
			supply: 1,
			lazyMint: false,
			uri: "https://arweave.net/Vt0uj2ql0ck-U5dLWDWJnwQaZPrvqkfxils8agrTiOc",
		})

		expect(mintRes.itemId).toBeTruthy()
		if (mintRes.type === MintType.ON_CHAIN) {
			await mintRes.transaction.wait()
		}

		const itemId = mintRes.itemId

		const orderId = await retry(10, 4000, async () => {
			const sell = await sdk.order.sell({ itemId })
			return sell.submit({
				amount: 1,
				currency: {
					"@type": "SOLANA_SOL",
				},
				price: toBigNumber("0.001"),
			})
		})

		console.log("orderid", orderId)

		const tx = await retry(10, 4000, async () => {
			const buy = await buyerSdk.order.buy({
				orderId,
			})

			return buy.submit({
				amount: 1,
				itemId,
			})
		})

		expect(tx.hash()).toBeTruthy()
		await tx.wait()
	})
})