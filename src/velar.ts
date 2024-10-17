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
  if (poolId.type == 8 || poolId.type == 9) throw "Pool does not exist";

  options.functionName = "lookup-pool";
  const poolData: any = await callReadOnlyFunction(options);
  if (poolData.type == 8) throw "Quoter contract error";

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
  amtIn: bigint | number,
  tokenInName: string,
  tokenInAddress: string,
  tokenOutName: string,
  tokenOutAddress: string,
  network: "mainnet" | "testnet",
  sender: string = "ST2F4BK4GZH6YFBNHYDDGN4T1RKBA7DA1BJZPJEJJ",
) {
  const result = await getVelarPoolData(
    velarContractAddress,
    tokenInName,
    tokenInAddress,
    tokenOutName,
    tokenOutAddress,
    "mainnet",
  );

  const contractName = "univ2-library";
  const functionName = "get-amount-out";
  const options = {
    contractAddress: velarContractAddress,
    contractName,
    functionName,
    functionArgs: [
      Cl.uint(amtIn),
      Cl.uint(result.reserve0),
      Cl.uint(result.reserve1),
      Cl.tuple({
        num: Cl.uint(result.swapFee.num),
        den: Cl.uint(result.swapFee.den),
      }),
    ],
    network,
    senderAddress: sender,
  };

  const amtOut: any = await callReadOnlyFunction(options);
  if (amtOut.type == 8) throw "Quoter contract error";
  return amtOut.value.value;
}
