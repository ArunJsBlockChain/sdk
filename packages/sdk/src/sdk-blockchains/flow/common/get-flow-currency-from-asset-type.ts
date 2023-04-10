import type { AssetType } from "@rarible/api-client"
import { EthEthereumAssetType } from "../../ethereum/common"
import { getFungibleTokenName } from "./converters"

export function getFlowCurrencyFromAssetType(assetType: AssetType | EthEthereumAssetType) {
	if (assetType["@type"] === "FLOW_FT") {
		return getFungibleTokenName(assetType.contract)
	}
	throw new Error("Invalid asset type")
}
