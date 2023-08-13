const { assert } = require("chai");
const wasm_tester = require("circom_tester").wasm;

describe("Multiplier circuit", function () {
  let multiplierCircuit;

  before(async function () {
    multiplierCircuit = await wasm_tester("circuit/multiplier.circom");
  });

  it("Should generate the witness successfully", async function () {
    const input = {in: [1, 5]};
    const witness = await multiplierCircuit.calculateWitness(input);
    await multiplierCircuit.assertOut(witness, {});
  });

  it("Should fail because there is a number out of bounds", async function () {
    const input = {in: [4, 5, 7]};
    try {
      await multiplierCircuit.calculateWitness(input);
    } catch (err) {
    //   console.log(err);
      assert(err.message.includes("Too many values for input signal in"));
    }
  });
  it("Should fail because input values ar less than expected", async function () {
    const input = {
        in: [4]
    }
    try {
      await multiplierCircuit.calculateWitness(input);
    } catch (err) {
    //   console.log(err);
      assert(err.message.includes("Not enough values for input signal in"));
    }
  });
  it("Should fail because both the numbers are equal", async function () {
    const input = {
      in: [2, 2]
    };
    try {
      const a = await multiplierCircuit.calculateWitness(input);
    } catch (err) {
    //   console.log(err);
      assert(err.message.includes("Assert Failed"));
    }
  });
  it("Should fail because the number is greater than 5", async function () {
    const input = {
      in: [2, 7]
    };
    try {
      const a = await multiplierCircuit.calculateWitness(input);
    } catch (err) {
    //   console.log(err);
      assert(err.message.includes("Assert Failed"));
    }
  });
});
