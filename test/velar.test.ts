import { getVelarPoolData, velarQuoter } from "../src";
import {
  aeusdcContractAddress,
  aeusdcContractName,
  ststxContractAddress,
  ststxContractName,
  velar,
  defaultSender,
} from "./constants";

describe("Velar quoter", () => {
  it("returns a value", async () => {
    const result = await getVelarPoolData(
      velar,
      ststxContractName,
      ststxContractAddress,
      aeusdcContractName,
      aeusdcContractAddress,
      "mainnet",
      defaultSender,
    );
    expect(result.flipped).toBe(false);

    const amtOut = await velarQuoter(
      velar,
      100n,
      ststxContractName,
      ststxContractAddress,
      aeusdcContractName,
      aeusdcContractAddress,
      "mainnet",
      defaultSender,
    );

    expect(Number(amtOut)).toBeGreaterThan(150);
  });
});
