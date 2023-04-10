import type { UnionAddress } from "@rarible/types"
import type { Order, OrderId } from "@rarible/api-client"
import type { BigNumberValue } from "@rarible/utils"
import type { Action } from "@rarible/action"
import type { IBlockchainTransaction } from "@zodeak/sdk-transaction"
import type { RequestCurrency } from "../common/domain"
import { ExtendBlockchain } from "../sdk-blockchains/ethereum/common"

export type IGetBalance = (address: UnionAddress, currency: RequestCurrency) => Promise<BigNumberValue>

/**
 * Convert funds to wrapped token or unwrap existed tokens (ex. ETH->wETH, wETH->ETH)
 * @param blockchain Blockchain where performs operation
 * @param isWrap Is wrap or unwrap operation
 * @param value amount of funds to convert
 */
export type IConvert = (request: ConvertRequest) => Promise<IBlockchainTransaction>

export type ConvertRequest = {
	blockchain: ExtendBlockchain
	isWrap: boolean
	value: BigNumberValue
}


export type CurrencyOrOrder = {
	currency: RequestCurrency
} | {
	order: Order
} | {
	orderId: OrderId
} | {
	blockchain: ExtendBlockchain
}

export type GetBiddingBalanceRequest = {
	walletAddress: UnionAddress
} & CurrencyOrOrder

export type IGetBiddingBalance = (request: GetBiddingBalanceRequest) => Promise<BigNumberValue>

export type DepositBiddingBalanceRequest = {
	amount: BigNumberValue
} & CurrencyOrOrder

export type IDepositBiddingBalance = Action<"send-tx", DepositBiddingBalanceRequest, IBlockchainTransaction>

export type WithdrawBiddingBalanceRequest = {
	amount: BigNumberValue
} & CurrencyOrOrder

export type IWithdrawBiddingBalance = Action<"send-tx", WithdrawBiddingBalanceRequest, IBlockchainTransaction>
