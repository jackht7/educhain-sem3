// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

interface INFT {
    function mint(address to, string memory tokenUri) external;
}
