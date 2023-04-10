import type { FlowContractAddress } from "@rarible/flow-sdk"
import { ExtendBlockchain } from "../../ethereum/common"

export type ParsedFlowItemIdFromUnionItemId = { blockchain: ExtendBlockchain, contract: FlowContractAddress, itemId: string }
