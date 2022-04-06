import { awaitAll, deployTestErc20, deployTestErc721 } from "@rarible/ethereum-sdk-test-common"
import { Web3Ethereum } from "@rarible/web3-ethereum"
import { EthereumWallet } from "@rarible/sdk-wallet"
import { toContractAddress, toCurrencyId, toItemId } from "@rarible/types"
import { createRaribleSdk } from "../../index"
import { LogsLevel } from "../../domain"
import { initProviders } from "./test/init-providers"
import { awaitStock } from "./test/await-stock"
import { awaitItem } from "./test/await-item"

describe("sale", () => {
	const { web31, web32, wallet1, wallet2 } = initProviders()
	const ethereum1 = new Web3Ethereum({ web3: web31 })
	const ethereum2 = new Web3Ethereum({ web3: web32 })
	const sdk1 = createRaribleSdk(new EthereumWallet(ethereum1), "e2e", { logs: LogsLevel.DISABLED })
	const sdk2 = createRaribleSdk(new EthereumWallet(ethereum2), "e2e", { logs: LogsLevel.DISABLED })

	const conf = awaitAll({
		testErc20: deployTestErc20(web31, "Test1", "TST1"),
		testErc721: deployTestErc721(web31, "Test2", "TST2"),
	})

	test("erc721 sell/buy using erc-20", async () => {
		const wallet1Address = wallet1.getAddressString()
		const wallet2Address = wallet2.getAddressString()
		const tokenId = 1
		await conf.testErc721.methods.mint(wallet1Address, tokenId, "").send({ from: wallet1Address, gas: 200000 })
		await conf.testErc20.methods.mint(wallet2Address, 100).send({ from: wallet1Address, gas: 200000 })
		const itemId = toItemId(`ETHEREUM:${conf.testErc721.options.address}:${tokenId}`)

		await awaitItem(sdk1, itemId)

		const sellAction = await sdk1.order.sell({ itemId })
		const orderId = await sellAction.submit({
			amount: 1,
			price: "0.000000000000000002",
			currency: {
				"@type": "ERC20",
				contract: toContractAddress(`ETHEREUM:${conf.testErc20.options.address}`),
			},
			expirationDate: new Date(Date.now() + 20000),
		})

		const nextStock = "1"
		const order = await awaitStock(sdk1, orderId, nextStock)
		expect(order.makeStock.toString()).toEqual(nextStock)

		const updateAction = await sdk1.order.sellUpdate({ orderId })
		await updateAction.submit({ price: "0.000000000000000001" })

		await sdk1.apis.order.getOrderById({ id: orderId })

		const fillAction = await sdk2.order.buy({ orderId })

		const tx = await fillAction.submit({ amount: 1 })
		await tx.wait()

		const nextStock2 = "0"
		const order2 = await awaitStock(sdk1, orderId, nextStock2)
		expect(order2.makeStock.toString()).toEqual(nextStock2)
	})

	test("erc721 sell/buy using erc-20 with order object", async () => {
		const wallet1Address = wallet1.getAddressString()
		const wallet2Address = wallet2.getAddressString()
		const tokenId = 2
		await conf.testErc721.methods.mint(wallet1Address, tokenId, "").send({ from: wallet1Address, gas: 200000 })
		await conf.testErc20.methods.mint(wallet2Address, 100).send({ from: wallet1Address, gas: 200000 })
		const itemId = toItemId(`ETHEREUM:${conf.testErc721.options.address}:${tokenId}`)

		await awaitItem(sdk1, itemId)

		const sellAction = await sdk1.order.sell({ itemId })
		const orderId = await sellAction.submit({
			amount: 1,
			price: "0.000000000000000002",
			currency: {
				"@type": "ERC20",
				contract: toContractAddress(`ETHEREUM:${conf.testErc20.options.address}`),
			},
		})

		const nextStock = "1"
		const order = await awaitStock(sdk1, orderId, nextStock)
		expect(order.makeStock.toString()).toEqual(nextStock)

		const fillAction = await sdk2.order.buy({ order })

		const tx = await fillAction.submit({ amount: 1 })
		await tx.wait()

		const nextStock2 = "0"
		const order2 = await awaitStock(sdk1, orderId, nextStock2)
		expect(order2.makeStock.toString()).toEqual(nextStock2)
	})

	test.skip("erc721 sell/buy using erc-20 throw error with outdated expiration date", async () => {
		const wallet1Address = wallet1.getAddressString()
		const wallet2Address = wallet2.getAddressString()
		const tokenId = 3
		await conf.testErc721.methods.mint(wallet1Address, tokenId, "").send({ from: wallet1Address, gas: 200000 })
		await conf.testErc20.methods.mint(wallet2Address, 100).send({ from: wallet1Address, gas: 200000 })
		const itemId = toItemId(`ETHEREUM:${conf.testErc721.options.address}:${tokenId}`)

		await awaitItem(sdk1, itemId)

		const sellAction = await sdk1.order.sell({ itemId })
		const orderId = await sellAction.submit({
			amount: 1,
			price: "0.000000000000000002",
			currency: {
				"@type": "ERC20",
				contract: toContractAddress(`ETHEREUM:${conf.testErc20.options.address}`),
			},
			expirationDate: new Date(),
		})

		const nextStock = "1"
		const order = await awaitStock(sdk1, orderId, nextStock)
		expect(order.makeStock.toString()).toEqual(nextStock)

		const fillAction = await sdk2.order.buy({ orderId })

		let errorMessage
		try {
			const tx = await fillAction.submit({ amount: 1 })
			await tx.wait()
		} catch (e: any) {
			errorMessage = e.message
		}
		expect(errorMessage).toBeTruthy()
	})

	test("erc721 sell/buy using erc-20 with CurrencyId", async () => {
		const wallet1Address = wallet1.getAddressString()
		const wallet2Address = wallet2.getAddressString()
		const tokenId = 4
		await conf.testErc721.methods.mint(wallet1Address, tokenId, "").send({ from: wallet1Address, gas: 200000 })
		await conf.testErc20.methods.mint(wallet2Address, 100).send({ from: wallet1Address, gas: 200000 })
		const itemId = toItemId(`ETHEREUM:${conf.testErc721.options.address}:${tokenId}`)

		await awaitItem(sdk1, itemId)

		const sellAction = await sdk1.order.sell({ itemId })
		const orderId = await sellAction.submit({
			amount: 1,
			price: "0.000000000000000002",
			currency: toCurrencyId(`ETHEREUM:${conf.testErc20.options.address}`),
		})

		const nextStock = "1"
		const order = await awaitStock(sdk1, orderId, nextStock)
		expect(order.makeStock.toString()).toEqual(nextStock)

		const fillAction = await sdk2.order.buy({ order })

		const tx = await fillAction.submit({ amount: 1 })
		await tx.wait()

		const nextStock2 = "0"
		const order2 = await awaitStock(sdk1, orderId, nextStock2)
		expect(order2.makeStock.toString()).toEqual(nextStock2)
	})

})
