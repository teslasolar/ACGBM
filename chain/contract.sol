// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title BarcodeMonsters — Guild Trading Card NFT
/// @notice Every card IS a scannable barcode. Every monster IS a guild member.
/// @dev ERC-721 compatible NFT contract for Barcode Monsters cards

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BarcodeMonsters is ERC721, Ownable {

    struct CardStats {
        uint16 atk;
        uint16 def;
        uint16 spd;
        uint16 res;
    }

    struct Card {
        string cardId;        // BCM-001
        string monsterName;   // Guildforge Sentinel
        string memberId;      // thomas
        string monsterType;   // SENTINEL
        string element;       // CRYSTAL
        uint8 tier;           // 1-3
        CardStats stats;
        string rarity;        // COMMON → LEGENDARY
        string set;           // GEN-1
        string stlHash;       // IPFS hash of 3D model
        uint32 printCount;    // times STL downloaded
        uint32 wins;
        uint32 losses;
        uint32 draws;
        bool evolved;
    }

    mapping(uint256 => Card) public cards;
    mapping(string => uint256) public memberToToken;
    uint256 public totalSupply;
    uint256 public constant MAX_SUPPLY = 510; // 510,510 wink

    event CardMinted(uint256 indexed tokenId, string memberId, string monsterName);
    event CardEvolved(uint256 indexed tokenId, string monsterName);
    event BattleResolved(uint256 indexed cardA, uint256 indexed cardB, uint256 winner);
    event STLDownloaded(uint256 indexed tokenId, uint32 printCount);

    constructor() ERC721("BarcodeMonsters", "BCM") Ownable(msg.sender) {}

    /// @notice Mint a new card from member data
    function mint(
        address to,
        string calldata cardId,
        string calldata monsterName,
        string calldata memberId,
        string calldata monsterType,
        string calldata element,
        uint8 tier,
        uint16 atk, uint16 def, uint16 spd, uint16 res,
        string calldata rarity,
        string calldata stlHash
    ) external onlyOwner returns (uint256) {
        require(totalSupply < MAX_SUPPLY, "Max supply reached");
        require(memberToToken[memberId] == 0 || totalSupply == 0, "Member already has card");

        uint256 tokenId = totalSupply;
        _mint(to, tokenId);

        cards[tokenId] = Card({
            cardId: cardId,
            monsterName: monsterName,
            memberId: memberId,
            monsterType: monsterType,
            element: element,
            tier: tier,
            stats: CardStats(atk, def, spd, res),
            rarity: rarity,
            set: "GEN-1",
            stlHash: stlHash,
            printCount: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            evolved: false
        });

        memberToToken[memberId] = tokenId;
        totalSupply++;

        emit CardMinted(tokenId, memberId, monsterName);
        return tokenId;
    }

    /// @notice Verify a card is authentic
    function verify(uint256 tokenId) external view returns (bool, Card memory) {
        require(tokenId < totalSupply, "Card does not exist");
        return (true, cards[tokenId]);
    }

    /// @notice Record a battle result
    function battle(uint256 cardA, uint256 cardB, uint8 result) external onlyOwner {
        require(cardA < totalSupply && cardB < totalSupply, "Invalid cards");
        // result: 0 = A wins, 1 = B wins, 2 = draw
        if (result == 0) {
            cards[cardA].wins++;
            cards[cardB].losses++;
            emit BattleResolved(cardA, cardB, cardA);
        } else if (result == 1) {
            cards[cardB].wins++;
            cards[cardA].losses++;
            emit BattleResolved(cardA, cardB, cardB);
        } else {
            cards[cardA].draws++;
            cards[cardB].draws++;
            emit BattleResolved(cardA, cardB, type(uint256).max);
        }
    }

    /// @notice Evolve a card (when member levels up)
    function evolve(uint256 tokenId) external onlyOwner {
        require(tokenId < totalSupply, "Card does not exist");
        require(!cards[tokenId].evolved, "Already evolved");

        Card storage card = cards[tokenId];
        card.stats.atk = uint16(uint256(card.stats.atk) * 120 / 100);
        card.stats.def = uint16(uint256(card.stats.def) * 120 / 100);
        card.stats.spd = uint16(uint256(card.stats.spd) * 120 / 100);
        card.stats.res = uint16(uint256(card.stats.res) * 120 / 100);
        card.evolved = true;

        emit CardEvolved(tokenId, card.monsterName);
    }

    /// @notice Record STL download
    function recordPrint(uint256 tokenId) external {
        require(tokenId < totalSupply, "Card does not exist");
        cards[tokenId].printCount++;
        emit STLDownloaded(tokenId, cards[tokenId].printCount);
    }

    /// @notice Get battle record
    function getBattleRecord(uint256 tokenId) external view returns (uint32, uint32, uint32) {
        require(tokenId < totalSupply, "Card does not exist");
        Card storage card = cards[tokenId];
        return (card.wins, card.losses, card.draws);
    }
}
