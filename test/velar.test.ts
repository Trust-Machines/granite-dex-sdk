import { getVelarPoolData, velarQuoter } from "../src";

// SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc
// SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token

describe("Velar quoter", () => {
  it("returns a value", async () => {
    const result = await getVelarPoolData(
      "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1",
      "ststx-token",
      "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG",
      "token-aeusdc",
      "SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K",
      "mainnet",
    );
    expect(result.flipped).toBe(false);

    const amtOut = await velarQuoter(
      "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1",
      100n,
      "ststx-token",
      "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG",
      "token-aeusdc",
      "SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K",
      "mainnet",
    );

    expect(Number(amtOut)).toBeCloseTo(176);
  });
});
