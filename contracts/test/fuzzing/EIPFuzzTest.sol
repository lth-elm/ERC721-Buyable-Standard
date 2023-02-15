// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../NFTContract.sol";

contract EIPFuzzTest is NFTContract {
    constructor() NFTContract() {}

    function echidna_test_owner() public view returns (bool) {
        return owner() == address(0x90001);
    }

    function echidna_test_default_royalty() public pure returns (bool) {
        return _defaultRoyalty() == 1000;
    }

    function echidna_test_royalty_denominator() public pure returns (bool) {
        return _royaltyDenominator() == 10000;
    }

    function echidna_test_royalty() public view returns (bool) {
        return _royalty() == 1000;
    }
}
