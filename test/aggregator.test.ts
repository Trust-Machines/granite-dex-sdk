import { getBestPath } from "../src";
import {
  aeusdcContractAddress,
  aeusdcContractName,
  alex,
  ststxContractAddress,
  ststxContractName,
  susdtContractAddress,
  susdtContractName,
  velar,
  wstxContractAddress,
  wstxContractName,
  defaultSender,
} from "./constants";

describe("Aggregator quoter", () => {
  it("alex is the best path", async () => {
    const res = await getBestPath(
      velar,
      alex,
      100n,
      wstxContractName,
      wstxContractAddress,
      susdtContractName,
      susdtContractAddress,
      "mainnet",
      defaultSender,
    );

    expect(res.dex).toBe("alex");
  });

  it("velar is the best path", async () => {
    const res = await getBestPath(
      velar,
      alex,
      100n,
      ststxContractName,
      ststxContractAddress,
      aeusdcContractName,
      aeusdcContractAddress,
      "mainnet",
      defaultSender,
    );

    expect(res.dex).toBe("velar");
    expect(res.data?.shareFeeTo).toBe(
      "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-share-fee-to",
    );
  });
});
