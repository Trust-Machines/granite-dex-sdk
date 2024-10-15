import { callReadOnlyFunction, Cl } from "@stacks/transactions";

export async function getAlexPoolData(
  alexContractAddress: string,
  tokenInName: string,
  tokenInAddress: string,
  tokenOutName: string,
  tokenOutAddress: string,
  factor: bigint | number,
  network: "mainnet" | "testnet",
  sender: string = "ST2F4BK4GZH6YFBNHYDDGN4T1RKBA7DA1BJZPJEJJ",
) {
  const contractName = "amm-registry-v2-01";
  const functionName = "get-pool-details";
  const options = {
    contractAddress: alexContractAddress,
    contractName,
    functionName,
    functionArgs: [
      Cl.contractPrincipal(tokenInAddress, tokenInName),
      Cl.contractPrincipal(tokenOutAddress, tokenOutName),
      Cl.uint(factor),
    ],
    network,
    senderAddress: sender,
  };

  const poolData: any = await callReadOnlyFunction(options);
  if (poolData.type == 8) throw "Pool does not exist";
  return {
    poolId: poolData.value.data["pool-id"].value,
    balanceX: poolData.value.data["balance-x"].value,
    balanceY: poolData.value.data["balance-y"].value,
  };
}

/// @dev factor is either 0.05e8 (for stableswap) or 1e8 (for risky swap)
export async function alexQuoter(
  alexContractAddress: string,
  amtIn: bigint | number,
  tokenInName: string,
  tokenInAddress: string,
  tokenOutName: string,
  tokenOutAddress: string,
  network: "mainnet" | "testnet",
  sender: string = "ST2F4BK4GZH6YFBNHYDDGN4T1RKBA7DA1BJZPJEJJ",
): Promise<number> {
  const alexFactor0 = 100000000;
  const alexFactor1 = 5000000;

  const contractName = "amm-pool-v2-01";
  const functionName = "get-helper";
  const options = {
    contractAddress: alexContractAddress,
    contractName,
    functionName,
    functionArgs: [
      Cl.contractPrincipal(tokenInAddress, tokenInName),
      Cl.contractPrincipal(tokenOutAddress, tokenOutName),
      Cl.uint(alexFactor0),
      Cl.uint(amtIn), // dx
    ],
    network,
    senderAddress: sender,
  };

  let amtOut: any = await callReadOnlyFunction(options);
  if (amtOut.type == 8) {
    // try with the other factor
    options.functionArgs[2] = Cl.uint(alexFactor1);
    amtOut = await callReadOnlyFunction(options);
    if (amtOut.type == 8) throw "Quoter contract error";
  }

  return amtOut.value.value;
}
