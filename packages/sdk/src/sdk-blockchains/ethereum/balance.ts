import type { RaribleSdk } from "@zodeak/ethereum-sdk"
import type { UnionAddress } from "@rarible/types"
import type { BigNumberValue } from "@rarible/utils"
import { ExtendBlockchain, IBlockchainTransaction } from "@zodeak/sdk-transaction"
import { BlockchainEthereumTransaction } from "@zodeak/sdk-transaction"
import type { EthereumNetwork } from "@zodeak/ethereum-sdk/build/types"
import type { AssetType as EthereumAssetType } from "@rarible/ethereum-api-client"
import { Action } from "@rarible/action"
import { toContractAddress } from "@rarible/types"
import type { ConvertRequest } from "../../types/balances"
import type {
	DepositBiddingBalanceRequest,
	GetBiddingBalanceRequest,
	WithdrawBiddingBalanceRequest,
} from "../../types/balances"
import { getCurrencyAssetType } from "../../common/get-currency-asset-type"
import type { RequestCurrency } from "../../common/domain"
import type { IApisSdk } from "../../domain"
import { convertToEthereumAddress, convertToEthereumAssetType } from "./common"

export class EthereumBalance {
	constructor(
		private sdk: RaribleSdk,
		private readonly apis: IApisSdk,
		private network: EthereumNetwork,
	) {
		this.getBalance = this.getBalance.bind(this)
		this.convert = this.convert.bind(this)
		this.getBiddingBalance = this.getBiddingBalance.bind(this)
	}

	async getBalance(address: UnionAddress, currency: RequestCurrency): Promise<BigNumberValue> {
		const assetType = getCurrencyAssetType(currency)
		const convertedAssetType = convertToEthereumAssetType(assetType)
		if (convertedAssetType.assetClass !== "ETH" && convertedAssetType.assetClass !== "ERC20") {
			throw new Error("Unsupported asset type for getting balance")
		}
		const ethAddress = convertToEthereumAddress(address)
		return this.sdk.balances.getBalance(ethAddress, convertedAssetType)
	}

	async convert(request: ConvertRequest): Promise<IBlockchainTransaction> {
		const wethContract = this.sdk.balances.getWethContractAddress()
		let from: EthereumAssetType
		let to: EthereumAssetType

		if (request.isWrap) {
			from = { assetClass: "ETH" }
			to = {
				assetClass: "ERC20",
				contract: wethContract,
			}
		} else {
			from = {
				assetClass: "ERC20",
				contract: wethContract,
			}
			to = { assetClass: "ETH" }
		}
		const tx = await this.sdk.balances.convert(from, to, request.value)
		return new BlockchainEthereumTransaction(tx, this.network)
	}

	async getBiddingBalance(request: GetBiddingBalanceRequest): Promise<BigNumberValue> {
		if ("currency" in request) {
			return this.getBalance(request.walletAddress, request.currency)
		} else {
			const wethContract = this.sdk.balances.getWethContractAddress()

			return this.getBalance(request.walletAddress, {
				"@type": "ERC20",
				contract: toContractAddress("ETHEREUM:" + wethContract),
			})
		}
	}

	depositBiddingBalance = Action
		.create({
			id: "send-tx" as const,
			run: async (request: DepositBiddingBalanceRequest) => {
				return this.convert({
					blockchain: ExtendBlockchain.ETHEREUM,
					isWrap: true,
					value: request.amount,
				})
			},
		})

	withdrawBiddingBalance = Action
		.create({
			id: "send-tx" as const,
			run: async (request: WithdrawBiddingBalanceRequest) => {
				return this.convert({
					blockchain: ExtendBlockchain.ETHEREUM,
					isWrap: false,
					value: request.amount,
				})
			},
		})
}
