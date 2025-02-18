import type { RaribleSdk } from "@zodeak/ethereum-sdk"
import { Action } from "@rarible/action"
import { toBigNumber } from "@rarible/types"
import { BlockchainEthereumTransaction } from "@zodeak/sdk-transaction"
import type { EthereumNetwork } from "@zodeak/ethereum-sdk/build/types"
import type { PrepareTransferRequest, TransferRequest } from "../../types/nft/transfer/domain"
import { convertToEthereumAddress, isEVMBlockchain } from "./common"
import { getNftCollectionById, getNftItemById } from "../../zodeak-api-client"

export class EthereumTransfer {
	constructor(
		private sdk: RaribleSdk,
		private network: EthereumNetwork,
	) {
		this.transfer = this.transfer.bind(this)
	}

	async transfer(prepare: PrepareTransferRequest) {
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
				id: "transfer" as const,
				run: async (request: TransferRequest) => {
					const amount = request.amount !== undefined ? toBigNumber(request.amount.toFixed()) : undefined

					const tx = await this.sdk.nft.transfer(
						{
						  contract: item.contract,
						  tokenId: item.tokenId,
					  },
						convertToEthereumAddress(request.to),
						amount
					)

					return new BlockchainEthereumTransaction(tx, this.network)
				},
			}),
		}
	}
}
