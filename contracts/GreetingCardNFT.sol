// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract GreetingCardNFT is ERC721, ERC721URIStorage, Pausable, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;
    uint256 public price;
    uint256 public constant ONE_USDC = 1_000_000;
    uint256 private _tokenIds;
    mapping(uint256 => address) public cardRecipient;
    mapping(address => uint256[]) private cardsSent;
    mapping(address => uint256[]) private cardsReceived;
    mapping(uint256 => address) private cardSender;

    event CardMinted(uint256 indexed tokenId, address indexed sender, address indexed recipient, string tokenURI);

    constructor(string memory name_, string memory symbol_, address initialOwner, address usdc_)
        ERC721(name_, symbol_)
    {
        require(usdc_ != address(0), "GreetingCardNFT: zero USDC");
        usdc = IERC20(usdc_);
        price = ONE_USDC;
        transferOwnership(initialOwner);
    }

    function ownerMint(string memory uri, address recipient, address originalSender) external onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 tokenId = _tokenIds;
        cardRecipient[tokenId] = recipient;
        cardSender[tokenId] = originalSender;
        cardsSent[originalSender].push(tokenId);
        cardsReceived[recipient].push(tokenId);
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, uri);
        emit CardMinted(tokenId, originalSender, recipient, uri);
        return tokenId;
    }

    function mintGreetingCard(string memory uri, address recipient) public returns (uint256) {
        usdc.safeTransferFrom(msg.sender, owner(), price);
        _tokenIds++;
        uint256 tokenId = _tokenIds;
        cardRecipient[tokenId] = recipient;
        cardSender[tokenId] = msg.sender;
        cardsSent[msg.sender].push(tokenId);
        cardsReceived[recipient].push(tokenId);
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, uri);
        emit CardMinted(tokenId, msg.sender, recipient, uri);
        return tokenId;
    }

    function getCardsSent(address sender) external view returns (uint256[] memory) {
        return cardsSent[sender];
    }

    function getCardsReceived(address recipient) external view returns (uint256[] memory) {
        return cardsReceived[recipient];
    }

    function getCardDetails(uint256 tokenId)
        external
        view
        returns (address sender, address recipient, address currentOwner, string memory uri)
    {
        sender = cardSender[tokenId];
        recipient = cardRecipient[tokenId];
        currentOwner = ownerOf(tokenId);
        uri = tokenURI(tokenId);
    }

    function setPrice(uint256 newPrice) external onlyOwner { price = newPrice; }
    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal override(ERC721) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
