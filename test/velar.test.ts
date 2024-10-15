import { getVelarPoolData, velarQuoter } from "../src";
import {
  aeusdcContractAddress,
  aeusdcContractName,
  ststxContractAddress,
  ststxContractName,
  velar,
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
    );

    expect(Number(amtOut)).toBeGreaterThan(150);
  });
});
