import { callReadOnlyFunction, Cl, cvToJSON } from "@stacks/transactions";

export async function getVelarPoolData(
  velarContractAddress: string,
  tokenInName: string,
  tokenInAddress: string,
  tokenOutName: string,
  tokenOutAddress: string,
  network: "mainnet" | "testnet",
  sender: string = "ST2F4BK4GZH6YFBNHYDDGN4T1RKBA7DA1BJZPJEJJ",
) {
  const contractName = "univ2-core";
  const functionName = "get-pool-id";
  const options = {
    contractAddress: velarContractAddress,
    contractName,
    functionName,
    functionArgs: [
      Cl.contractPrincipal(tokenInAddress, tokenInName),
      Cl.contractPrincipal(tokenOutAddress, tokenOutName),
    ],
    network,
    senderAddress: sender,
  };

  const poolId: any = await callReadOnlyFunction(options);
  options.functionName = "lookup-pool";
  const poolData: any = await callReadOnlyFunction(options);

  return {
    poolId: poolId.value.value,
    flipped: poolData.value.data.flipped.type == 4 ? false : true,
    lpToken: cvToJSON(poolData.value.data.pool.data["lp-token"]).value,
    reserve0: poolData.value.data.pool.data.reserve0.value,
    reserve1: poolData.value.data.pool.data.reserve1.value,
    swapFee: {
      num: poolData.value.data.pool.data["swap-fee"].data.num.value,
      den: poolData.value.data.pool.data["swap-fee"].data.den.value,
    },
    shareFee: {
      num: poolData.value.data.pool.data["share-fee"].data.num.value,
      den: poolData.value.data.pool.data["share-fee"].data.den.value,
    },
    protocolFee: {
      num: poolData.value.data.pool.data["protocol-fee"].data.num.value,
      den: poolData.value.data.pool.data["protocol-fee"].data.den.value,
    },
  };
}

export async function velarQuoter(
  velarContractAddress: string,
  amtIn: bigint,
  reserveIn: bigint,
  reserveOut: bigint,
  swapFeeNum: bigint,
  swapFeeDen: bigint,
  network: "mainnet" | "testnet",
  sender: string = "ST2F4BK4GZH6YFBNHYDDGN4T1RKBA7DA1BJZPJEJJ",
) {
  const contractName = "univ2-library";
  const functionName = "get-amount-out";
  const options = {
    contractAddress: velarContractAddress,
    contractName,
    functionName,
    functionArgs: [
      Cl.uint(amtIn),
      Cl.uint(reserveIn),
      Cl.uint(reserveOut),
      Cl.tuple({
        num: Cl.uint(swapFeeNum),
        den: Cl.uint(swapFeeDen),
      }),
    ],
    network,
    senderAddress: sender,
  };

  const amtOut: any = await callReadOnlyFunction(options);
  return amtOut.value.value;
}
