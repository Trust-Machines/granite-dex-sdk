import { alexQuoter, getAlexPoolData } from "../src";
import {
  alex,
  susdtContractAddress,
  susdtContractName,
  wstxContractAddress,
  wstxContractName,
  defaultSender,
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
      defaultSender,
    );
    expect(Number(poolData.poolId)).toBe(19);

    const data = await alexQuoter(
      alex,
      100n,
      wstxContractName,
      wstxContractAddress,
      susdtContractName,
      susdtContractAddress,
      "mainnet",
      defaultSender,
    );

    expect(Number(data.amtOut)).toBeGreaterThan(150);
  });
});
