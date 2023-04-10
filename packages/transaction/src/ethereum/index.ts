import { Blockchain } from "@rarible/api-client"
import type { EthereumTransaction } from "@rarible/ethereum-provider"
import type { EthereumNetwork } from "@zodeak/ethereum-sdk/build/types"
import { ExtendBlockchain, IBlockchainTransaction } from "../domain"

export class BlockchainEthereumTransaction<TransactionResult = undefined> implements
IBlockchainTransaction<ExtendBlockchain, TransactionResult> {
	blockchain: ExtendBlockchain

	constructor(
		public transaction: EthereumTransaction,
		public network: EthereumNetwork,
		public resultExtractor?: (receipt: Awaited<ReturnType<EthereumTransaction["wait"]>>) => TransactionResult | undefined,
	) {
		this.blockchain = this.getBlockchain(network)
	}

	private getBlockchain(network: EthereumNetwork): ExtendBlockchain {
		switch (network) {
			case "mumbai":
			case "polygon":
				return ExtendBlockchain.POLYGON
			case "binance":
			case "bscTestnet":
				return ExtendBlockchain.BINANCE
			default:
				return ExtendBlockchain.ETHEREUM
		}
	}

	hash() {
		return this.transaction.hash
	}

	async wait() {
		const receipt = await this.transaction.wait()

		return {
			blockchain: this.blockchain,
			hash: this.transaction.hash,
			result: this.resultExtractor?.(receipt),
		}
	}

	getTxLink() {
		switch (this.network) {
			case "mainnet":
				return `https://etherscan.io/tx/${this.hash()}`
			case "mumbai":
				return `https://mumbai.polygonscan.com/tx/${this.hash()}`
			case "polygon":
				return `https://polygonscan.com/tx/${this.hash()}`
			case "testnet":
				return `https://goerli.etherscan.io/tx/${this.hash()}`
			case "binance":
				return `https://https://bscscan.com/tx/${this.hash()}`
			case "bscTestnet":
				return `https://testnet.bscscan.com/tx/${this.hash()}`
			default:
				throw new Error("Unsupported transaction network")
		}
	}

	get isEmpty(): boolean {
		return false
	}
}
