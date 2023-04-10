import type { EthereumTransaction } from "@rarible/ethereum-provider"
import type { Blockchain } from "@rarible/api-client"

export enum ExtendBlockchain {
    ETHEREUM = "ETHEREUM",
    POLYGON = "POLYGON",
    FLOW = "FLOW",
    TEZOS = "TEZOS",
    SOLANA = "SOLANA",
    IMMUTABLEX = "IMMUTABLEX",
	BINANCE = "BINANCE"
}

interface Transaction<T extends ExtendBlockchain, TransactionResult = void> {
	blockchain: T
	hash: string
	result?: TransactionResult
}

export interface TransactionIndexer extends Record<ExtendBlockchain, any> {
	"ETHEREUM": EthereumTransaction
	"FLOW": FlowTransaction // @todo add typings from flow-sdk
}

export interface IBlockchainTransaction<T extends ExtendBlockchain = ExtendBlockchain, TransactionResult = undefined> {
	blockchain: T
	transaction: TransactionIndexer[T]
	/**
	 * Returns true if there is no transaction data and transaction object should be ignored
	 */
	isEmpty: boolean
	hash(): string
	wait(): Promise<Transaction<T, TransactionResult | undefined>>
	getTxLink(): string
}

export interface FlowTransaction {
	txId: string
	status: number
	events: any[]
}
