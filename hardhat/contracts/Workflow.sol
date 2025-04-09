// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./interfaces/INFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Workflow is ReentrancyGuard, Ownable {
    INFT public nftContract;

    constructor(address _nftContract) Ownable(msg.sender) {
        nftContract = INFT(_nftContract);
    }

    function triggerMint(address to, string memory tokenUri) public {
        require(owner() == msg.sender, "Caller is not the owner");
        nftContract.mint(to, tokenUri);
    }

    function getNftContract() public view returns (address) {
        return address(nftContract);
    }
}
