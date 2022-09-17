import type { Blockchain } from "@rarible/api-client"
import type { EthereumNetworkConfig } from "@zodeak/ethereum-sdk/build/types"

export interface IEthereumSdkConfig {
	useDataV3?: boolean
	marketplaceMarker?: string
	fillCalldata?: string
	[Blockchain.ETHEREUM]?: EthereumNetworkConfig
	[Blockchain.POLYGON]?: EthereumNetworkConfig
}
