import Web3 from "web3"

export function initWeb3Provider(rpcUrl: string) {
	return new Web3(new Web3.providers.HttpProvider(rpcUrl))
}

if (!process.env.RPC_URL) {
	throw new Error("RPC_URL env variable has not been set")
}
export const web3Provider = initWeb3Provider(process.env.RPC_URL)
