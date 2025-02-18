import type { FlowEnv } from "@rarible/flow-sdk/build/types"
import type { EthereumNetwork } from "@zodeak/ethereum-sdk/build/types"
import type { TezosNetwork } from "@rarible/tezos-sdk"
import type { SolanaCluster } from "@rarible/solana-sdk"
import type { ImxEnv } from "@rarible/immutable-wallet"

export type RaribleSdkEnvironment = "development" | "testnet" | "prod"

export type RaribleSdkConfig = {
	basePath: string
	ethereumEnv: EthereumNetwork
	flowEnv: FlowEnv
	tezosNetwork: TezosNetwork,
	polygonNetwork: EthereumNetwork,
	solanaNetwork: SolanaCluster
	immutablexNetwork: ImxEnv
	binanceEnv: EthereumNetwork
}
