import type { RaribleSdk } from "@zodeak/ethereum-sdk"
import { Action } from "@rarible/action"
import { BlockchainEthereumTransaction } from "@zodeak/sdk-transaction"
import type { EthereumNetwork } from "@zodeak/ethereum-sdk/build/types"
import type { CancelOrderRequest, ICancel } from "../../types/order/cancel/domain"
import { isEVMBlockchain } from "./common"
import { getOrderByHash } from "../../zodeak-api-client"

export class EthereumCancel {
	constructor(
		private readonly sdk: RaribleSdk,
		private network: EthereumNetwork,
	) {}

	cancel: ICancel = Action.create({
		id: "send-tx" as const,
		run: async (request: CancelOrderRequest) => {
			if (!request.orderId) {
				throw new Error("OrderId has not been specified")
			}
			const [blockchain, orderId] = request.orderId.split(":")
			if (!isEVMBlockchain(blockchain)) {
				throw new Error("Not an ethereum order")
			}

			const response = await getOrderByHash(orderId)
			const order = response.data

			const cancelTx = await this.sdk.order.cancel(order)
			return new BlockchainEthereumTransaction(cancelTx, this.network)
		},
	})
}
