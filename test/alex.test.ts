import { alexQuoter, getAlexPoolData } from "../src";
import {
  aeusdcContractAddress,
  aeusdcContractName,
  alex,
  ststxContractAddress,
  ststxContractName,
  susdtContractAddress,
  susdtContractName,
  wstxContractAddress,
  wstxContractName,
} from "./constants";

describe("Alex quoter", () => {
  it("returns a value", async () => {
    const poolData = await getAlexPoolData(
      alex,
      wstxContractName,
      wstxContractAddress,
      susdtContractName,
      susdtContractAddress,
      100000000,
      "mainnet",
    );
    expect(Number(poolData.poolId)).toBe(19);

    const amtOut = await alexQuoter(
      alex,
      100n,
      wstxContractName,
      wstxContractAddress,
      susdtContractName,
      susdtContractAddress,
      "mainnet",
    );

    expect(Number(amtOut)).toBeGreaterThan(150);
  });
});
