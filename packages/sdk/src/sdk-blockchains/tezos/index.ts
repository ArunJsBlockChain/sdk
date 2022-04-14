import type { TezosWallet } from "@rarible/sdk-wallet"
import type { Maybe } from "@rarible/types/build/maybe"
import type { TezosNetwork } from "@rarible/tezos-sdk"
import type { IApisSdk, IRaribleInternalSdk } from "../../domain"
import { Middlewarer } from "../../common/middleware/middleware"
import { TezosSell } from "./sell"
import { TezosFill } from "./fill"
import { TezosBid } from "./bid"
import { getMaybeTezosProvider, getTezosAPIs } from "./common"
import { TezosMint } from "./mint"
import { TezosTransfer } from "./transfer"
import { TezosBurn } from "./burn"
import { TezosTokenId } from "./token-id"
import { TezosCancel } from "./cancel"
import { TezosBalance } from "./balance"
import { TezosCreateCollection } from "./create-collection"
import { TezosCanTransfer } from "./restriction"

export function createTezosSdk(
	wallet: Maybe<TezosWallet>,
	_apis: IApisSdk,
	network: TezosNetwork,
): IRaribleInternalSdk {
	const apis = getTezosAPIs(network)
	const maybeProvider = getMaybeTezosProvider(wallet?.provider, network)
	const sellService = new TezosSell(maybeProvider, apis)
	const mintService = new TezosMint(maybeProvider, apis, network)
	const balanceService = new TezosBalance(maybeProvider, network)
	const bidService = new TezosBid(maybeProvider, apis, balanceService, network)
	const fillService = new TezosFill(maybeProvider, apis, network)
	const createCollectionService = new TezosCreateCollection(maybeProvider, network)

	return {
		nft: {
			mint: mintService.mint,
			burn: new TezosBurn(maybeProvider, apis, network).burn,
			transfer: new TezosTransfer(maybeProvider, apis, network).transfer,
			generateTokenId: new TezosTokenId(maybeProvider, apis).generateTokenId,
			deploy: createCollectionService.createCollection,
			createCollection: createCollectionService.createCollection,
			preprocessMeta: Middlewarer.skipMiddleware(mintService.preprocessMeta),
		},
		order: {
			fill: fillService.fill,
			buy: fillService.fill,
			acceptBid: fillService.fill,
			sell: sellService.sell,
			sellUpdate: sellService.update,
			bid: bidService.bid,
			bidUpdate: bidService.update,
			cancel: new TezosCancel(maybeProvider, apis, network).cancel,
		},
		balances: {
			getBalance: balanceService.getBalance,
			convert: balanceService.convert,
		},
		restriction: {
			canTransfer: new TezosCanTransfer(maybeProvider).canTransfer,
		},
	}
}
