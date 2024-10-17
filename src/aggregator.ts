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
  let velarAmtOut;

  try {
    velarAmtOut = await velarQuoter(
      velar,
      amtIn,
      tokenInName,
      tokenInAddress,
      tokenOutName,
      tokenOutAddress,
      network,
    );
  } catch {
    velarAmtOut = 0n;
  }

  let alexAmtOut;

  try {
    alexAmtOut = await alexQuoter(
      alex,
      amtIn,
      tokenInName,
      tokenInAddress,
      tokenOutName,
      tokenOutAddress,
      network,
    );
  } catch {
    alexAmtOut = 0n;
  }

  const dex = alexAmtOut > velarAmtOut ? "alex" : "velar";
  let data: any = {};

  if (dex == "velar")
    data = {
      shareFeeTo:
        "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-share-fee-to",
    };

  return {
    dex,
    amtOut: alexAmtOut > velarAmtOut ? alexAmtOut : velarAmtOut,
    data,
  };
}
