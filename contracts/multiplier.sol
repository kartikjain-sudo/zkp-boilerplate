// file: /contracts/multiplier.sol

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// Interface to GrothVerifier.sol
interface IGrothVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) external view returns (bool);
}

contract SimpleMultiplier {
    address public s_grothVerifierAddress;

    constructor(address grothVerifierAddress) {
        s_grothVerifierAddress = grothVerifierAddress;
    }

    // ZK proof is generated in the browser and submitted as a transaction w/ the proof as bytes.
    function submitProof(uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input) public view returns (bool) {
        bool result = IGrothVerifier(s_grothVerifierAddress).verifyProof(a, b, c, input);
        require(result, "Invalid Proof");
        return true;
    }
}