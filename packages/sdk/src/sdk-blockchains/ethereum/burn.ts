import type { RaribleSdk } from "@zodeak/ethereum-sdk"
import { Action } from "@rarible/action"
import { toBigNumber } from "@rarible/types"
import { BlockchainEthereumTransaction } from "@zodeak/sdk-transaction"
import type { EthereumNetwork } from "@zodeak/ethereum-sdk/build/types"
import type { BurnRequest, PrepareBurnRequest } from "../../types/nft/burn/domain"
import { isEVMBlockchain, toEthereumParts } from "./common"
import { getNftCollectionById, getNftItemById } from "../../zodeak-api-client"

export class EthereumBurn {
	constructor(
		private sdk: RaribleSdk,
		private network: EthereumNetwork,
	) {
		this.burn = this.burn.bind(this)
	}

	async burn(prepare: PrepareBurnRequest) {
		if (!prepare.itemId) {
			throw new Error("ItemId has not been specified")
		}

		const [domain, contract, tokenId] = prepare.itemId.split(":")
		if (!isEVMBlockchain(domain)) {
			throw new Error(`Not an ethereum item: ${prepare.itemId}`)
		}

		const response = await getNftItemById(`${contract}:${tokenId}`)
		const item = response.data

		const collectionResponse = await getNftCollectionById(item.contract)
		const collection = collectionResponse.data[0]

		return {
			multiple: collection.type === "ERC1155",
			maxAmount: item.supply,
			submit: Action.create({
				id: "burn" as const,
				run: async (request: BurnRequest) => {
					const amount = request?.amount !== undefined ? toBigNumber(request.amount.toFixed()) : undefined

					const tx = await this.sdk.nft.burn(
						{
							assetType: {
								contract: item.contract,
								tokenId: item.tokenId,
							},
						  amount,
							creators: toEthereumParts(request?.creators),
						},
					)

					return tx && new BlockchainEthereumTransaction(tx, this.network)
				},
			}),
		}
	}
}
