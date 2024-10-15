import { alexQuoter } from "./alex";
import { velarQuoter } from "./velar";

export async function getBestPath(
  velar: string,
  alex: string,
  amtIn: bigint | number,
  tokenInName: string,
  tokenInAddress: string,
  tokenOutName: string,
  tokenOutAddress: string,
  network: "mainnet" | "testnet",
) {
  const velarAmtOut = await velarQuoter(
    velar,
    amtIn,
    tokenInName,
    tokenInAddress,
    tokenOutName,
    tokenOutAddress,
    network,
  );

  const alexAmtOut = await alexQuoter(
    alex,
    amtIn,
    tokenInName,
    tokenInAddress,
    tokenOutName,
    tokenOutAddress,
    network,
  );

  return {
    dex: alexAmtOut > velarAmtOut ? "alex" : "velar",
    amtOut: Math.max(alexAmtOut, velarAmtOut),
  };
}
