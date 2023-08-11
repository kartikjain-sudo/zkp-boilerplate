
// file: /src/lib/generateProof.ts
// ts-node --esm scripts/generatingProofs.ts

import path from "path";
// @ts-ignore
import * as snarkjs from 'snarkjs';

export const generateProof = async (input0: number, input1: number, file: string): Promise<any> => {
  console.log(`Generating vote proof with inputs: ${input0}, ${input1}`);
  
  // We need to have the naming scheme and shape of the inputs match the .circom file
  const inputs = {
    in: [input0, input1],
  }

  // Paths to the .wasm file and proving key
  const wasmPath = path.join(process.cwd(), `./circuits/build/multiplier_js/${file}.wasm`);
  const provingKeyPath = path.join(process.cwd(), `./circuits/keys/${file}_final.zkey`)

  try {
    // Generate a proof of the circuit and create a structure for the output signals
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(inputs, wasmPath, provingKeyPath);

    // Convert the data into Solidity calldata that can be sent as a transaction
    const calldataBlob = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);

    const argv = calldataBlob
    .replace(/["[\]\s]/g, "")
    .split(",")
    .map((x: string | number | bigint | boolean) => BigInt(x).toString());

    const a = [argv[0], argv[1]];
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const Input = [];

    for (let i = 8; i < argv.length; i++) {
      Input.push(argv[i]);
    }

    return { a, b, c, Input }
  } catch (err) {
    console.log(`Error:`, err)
    return {
      proof: "", 
      publicSignals: [],
    }
  }
}

// async function main() {
//   const res = await generateProof(2, 5, 'multiplier');

//   return res;
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });