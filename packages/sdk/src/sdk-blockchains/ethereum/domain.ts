import type { EthereumNetworkConfig } from "@zodeak/ethereum-sdk/build/types"
import { ExtendBlockchain } from "../../sdk-blockchains/ethereum/common"

export interface IEthereumSdkConfig {
	useDataV3?: boolean
	marketplaceMarker?: string
	fillCalldata?: string
	[ExtendBlockchain.ETHEREUM]?: EthereumNetworkConfig
	[ExtendBlockchain.POLYGON]?: EthereumNetworkConfig
}
