import { alexQuoter } from "./alex";
import { getVelarPoolData, velarQuoter } from "./velar";

export async function getBestPath(
  velar: string,
  alex: string,
  amtIn: bigint | number,
  tokenInName: string,
  tokenInAddress: string,
  tokenOutName: string,
  tokenOutAddress: string,
  network: "mainnet" | "testnet",
  sender: string
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
      sender,
    );
  } catch {
    velarAmtOut = 0n;
  }

  let alexAmtOut;
  let alexPoolData: any = {};

  try {
    alexPoolData = await alexQuoter(
      alex,
      amtIn,
      tokenInName,
      tokenInAddress,
      tokenOutName,
      tokenOutAddress,
      network,
      sender,
    );
    alexAmtOut = alexPoolData.amtOut;
  } catch {
    alexAmtOut = 0n;
  }

  const dex = alexAmtOut > velarAmtOut ? "alex" : "velar";
  let data: any = {};

  let poolData: any = {};
  if (dex == "velar") {
    poolData = await getVelarPoolData(
      velar,
      tokenInName,
      tokenInAddress,
      tokenOutName,
      tokenOutAddress,
      network,
      sender,
    );
    data = {
      ...poolData,
      shareFeeTo:
        `${velar}.univ2-share-fee-to`,
    };
  } else {
    data = {
      factor: alexPoolData.factor,
    };
  }

  return {
    dex,
    amtOut: alexAmtOut > velarAmtOut ? alexAmtOut : velarAmtOut,
    data,
  };
}
