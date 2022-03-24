import { SolanaSdk } from "../sdk/sdk"
import { toPublicKey } from "../common/utils"

describe("solana sdk balance", () => {
	const sdk = SolanaSdk.create({ connection: { cluster: "devnet" }, debug: true })

	test("Should check account balance", async () => {
		const balance = await sdk.balances.getBalance(toPublicKey("6J9aYLQfDWc2QJpXz1M2k1R5AnVGGkqCzYmd3JnVqxB3"))
		expect(balance).toBeGreaterThan(0)
	})
})