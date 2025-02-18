import { Blockchain } from "@rarible/api-client"
import type { OperationResult } from "@rarible/tezos-sdk"
import type { TezosNetwork } from "@rarible/tezos-sdk"
import { ExtendBlockchain, IBlockchainTransaction } from "../domain"

export class BlockchainTezosTransaction implements IBlockchainTransaction {
	blockchain: ExtendBlockchain = ExtendBlockchain.TEZOS

	constructor(public transaction: OperationResult, public network: TezosNetwork) {}

	hash() {
		return this.transaction.hash
	}

	async wait() {
		await this.transaction.confirmation()

		return {
			blockchain: this.blockchain,
			hash: this.transaction.hash,
		}
	}

	getTxLink() {
		switch (this.network) {
			case "mainnet": return `https://tzkt.io/${this.hash()}`
			case "testnet": return `https://ithacanet.tzkt.io/${this.hash()}`
			default: throw new Error("Unsupported transaction network")
		}
	}

	get isEmpty(): boolean {
		return false
	}
}
