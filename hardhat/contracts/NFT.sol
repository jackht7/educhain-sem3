// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFT is ERC721URIStorage, Ownable {
    address public hookAddress;
    uint public nextNFTId;

    constructor() ERC721("Snapture", "SNAP") Ownable(msg.sender) {
        // _mint(msg.sender, 1);
    }

    modifier allowOwnerOrHook() {
        require(
            msg.sender == hookAddress || msg.sender == owner(),
            "Only the hook contract or owner can call this function"
        );
        _;
    }

    function mint(address to, string memory tokenUri) public allowOwnerOrHook {
        //request address of this tokenId is not exist
        require(_ownerOf(nextNFTId) == address(0), "tokenId already exists");

        _safeMint(to, nextNFTId);
        _setTokenURI(nextNFTId, tokenUri);

        nextNFTId++;
    }

    // Add this function to allow the owner to set hook contract
    function setHookAddress(address _hookAddress) public onlyOwner {
        hookAddress = _hookAddress;
    }
}
