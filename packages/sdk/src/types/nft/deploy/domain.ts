import type * as ApiClient from "@rarible/api-client"
import type { IBlockchainTransaction } from "@zodeak/sdk-transaction"
import type { ContractAddress, UnionAddress } from "@rarible/types"
import type { Action } from "@rarible/action"
import { ExtendBlockchain } from "../../../sdk-blockchains/ethereum/common"

export type CreateCollectionRequest<T extends CreateCollectionBlockchains = CreateCollectionBlockchains> = {
	blockchain: T;
	asset: CreateCollectionAsset[T]
}

export interface CreateCollectionAsset extends Record<CreateCollectionBlockchains, DeployTokenAsset> {
	[ExtendBlockchain.ETHEREUM]: EthereumCreateCollectionAsset;
	[ExtendBlockchain.TEZOS]: TezosCreateCollectionTokenAsset;
	[ExtendBlockchain.SOLANA]: SolanaCreateCollectionTokenAsset;
}

export type CreateCollectionBlockchains =
	ExtendBlockchain.ETHEREUM |
	ExtendBlockchain.POLYGON |
	ExtendBlockchain.TEZOS |
	ExtendBlockchain.SOLANA |
	ExtendBlockchain.BINANCE

export type DeployTokenAsset =
	EthereumCreateCollectionAsset |
	TezosCreateCollectionTokenAsset |
	SolanaCreateCollectionTokenAsset

export type SolanaCreateCollectionTokenAsset = {
	arguments: {
		metadataURI: string
	}
}

export type TezosCreateCollectionTokenAsset = {
	assetType: "NFT" | "MT"
	arguments: {
		name: string
		symbol: string
		contractURI: string
		isUserToken: boolean,
	}
}

export type EthereumCreateCollectionAsset = {
	assetType: "ERC721" | "ERC1155"
	arguments: CreatePrivateCollectionArguments | CreatePublicCollectionArguments
}

export type CreatePublicCollectionArguments = {
	name: string
	symbol: string
	baseURI: string
	contractURI: string
	isUserToken: false
}

export type CreatePrivateCollectionArguments =
  Omit<CreatePublicCollectionArguments, "isUserToken"> & {
  	isUserToken: true
  	operators: UnionAddress[]
  }

export type CreateCollectionResponse = {
	tx: IBlockchainTransaction,
	address: string
}

export type ICreateCollection = Action<"send-tx", CreateCollectionRequest, CreateCollectionResponse>
