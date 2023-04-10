import type { CurrencyType } from "../../../common/domain"
import { ExtendBlockchain } from "../../ethereum/common"

export function getCurrencies():  CurrencyType[] {
	return [{ blockchain: ExtendBlockchain.SOLANA, type: "NATIVE" }]
}
