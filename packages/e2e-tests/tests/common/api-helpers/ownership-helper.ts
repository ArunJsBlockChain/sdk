import { retry } from "@rarible/sdk/src/common/retry"
import type { IRaribleSdk } from "@rarible/sdk/src/domain"
import type { Ownership } from "@rarible/api-client/build/models"
import type { Blockchain, GetOwnershipByIdResponse } from "@rarible/api-client"
import type { BigNumber, ItemId } from "@rarible/types"


export async function getOwnershipById(sdk: IRaribleSdk, blockchain: Blockchain, contractAddress: string,
																			 tokenId: string, targetAddress: string): Promise<Ownership> {
	const ownership = await retry(10, 2000, async () => {
		return await sdk.apis.ownership.getOwnershipById({
			ownershipId: `${blockchain}:${contractAddress}:${tokenId}:${targetAddress}`,
		})
	})
	expect(ownership).not.toBe(null)
	return ownership
}

export async function awaitForOwnershipValue(sdk: IRaribleSdk, itemId: ItemId,
																						 recipientAddress: string, value?: BigNumber): Promise<Ownership> {
	const ownershipId = `${itemId}:${recipientAddress}`
	console.log("Await for ownershipId", ownershipId)
	const ownership = await retry(10, 2000, async () => {
		return await sdk.apis.ownership.getOwnershipById({
			ownershipId: ownershipId,
		})
	})
	expect(ownership).not.toBe(null)
	if (value) {
		expect(ownership.value).toBe(value)
		console.log("value", ownership.value)
	}
	return ownership
}

export async function getOwnershipByIdRaw(sdk: IRaribleSdk, itemId: ItemId,
	recipientAddress: string): Promise<GetOwnershipByIdResponse> {
	const ownershipId = `${itemId}:${recipientAddress}`
	const ownership = await retry(10, 2000, async () => {
		return await sdk.apis.ownership.getOwnershipByIdRaw({
			ownershipId: ownershipId,
		})
	})
	expect(ownership.value as Ownership).not.toBe(null)
	console.log(ownership.value)
	return ownership
}
