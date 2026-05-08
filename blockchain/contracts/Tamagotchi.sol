// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Tamagotchi is ERC721Enumerable, Ownable {
    using Strings for uint256;

    struct Pet {
        string name;
        uint256 hunger;      // 0-100 (100 is full, 0 is starving)
        uint256 happiness;   // 0-100 (100 is happy, 0 is sad)
        uint256 cleanliness; // 0-100 (100 is clean, 0 is dirty)
        uint256 health;      // 0-100 (100 is healthy, 0 is dead/sick)
        uint256 lastInteraction;
        uint256 birthTime;
    }

    mapping(uint256 => Pet) public pets;
    uint256 public nextTokenId;

    // Configurable settings (can be customized)
    uint256 public hungerDecayRate = 5;      // points per hour
    uint256 public happinessDecayRate = 3;   // points per hour
    uint256 public cleanlinessDecayRate = 2; // points per hour

    event PetMinted(uint256 indexed tokenId, string name, address indexed owner);
    event PetInteracted(uint256 indexed tokenId, string action, uint256 hunger, uint256 happiness, uint256 cleanliness);

    constructor() ERC721("AvaxTamagotchi", "AVXT") Ownable(msg.sender) {}

    function mint(string memory _name) public {
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);

        pets[tokenId] = Pet({
            name: _name,
            hunger: 80,
            happiness: 80,
            cleanliness: 80,
            health: 100,
            lastInteraction: block.timestamp,
            birthTime: block.timestamp
        });

        emit PetMinted(tokenId, _name, msg.sender);
    }

    function getPetStats(uint256 _tokenId) public view returns (
        uint256 hunger,
        uint256 happiness,
        uint256 cleanliness,
        uint256 health
    ) {
        Pet storage pet = pets[_tokenId];
        uint256 timePassed = block.timestamp - pet.lastInteraction;
        uint256 hoursPassed = timePassed / 3600;

        hunger = _calculateDecay(pet.hunger, hoursPassed, hungerDecayRate);
        happiness = _calculateDecay(pet.happiness, hoursPassed, happinessDecayRate);
        cleanliness = _calculateDecay(pet.cleanliness, hoursPassed, cleanlinessDecayRate);
        
        // Health logic: if any stat is 0, health drops
        health = pet.health;
        if (hunger == 0 || happiness == 0 || cleanliness == 0) {
            uint256 healthDrop = hoursPassed * 5; // drop 5 health per hour if any stat is 0
            if (healthDrop >= health) health = 0;
            else health -= healthDrop;
        }
    }

    function _calculateDecay(uint256 _val, uint256 _hours, uint256 _rate) internal pure returns (uint256) {
        uint256 decay = _hours * _rate;
        if (decay >= _val) return 0;
        return _val - decay;
    }

    function feed(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender, "Not your pet");
        (uint256 h, uint256 hap, uint256 c, uint256 health) = getPetStats(_tokenId);
        
        Pet storage pet = pets[_tokenId];
        pet.hunger = _clamp(h + 20);
        pet.happiness = hap;
        pet.cleanliness = c;
        pet.health = health;
        pet.lastInteraction = block.timestamp;

        emit PetInteracted(_tokenId, "feed", pet.hunger, pet.happiness, pet.cleanliness);
    }

    function play(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender, "Not your pet");
        (uint256 h, uint256 hap, uint256 c, uint256 health) = getPetStats(_tokenId);

        Pet storage pet = pets[_tokenId];
        pet.hunger = h;
        pet.happiness = _clamp(hap + 15);
        pet.cleanliness = _clamp(c > 5 ? c - 5 : 0); // Playing makes it a bit dirty
        pet.health = health;
        pet.lastInteraction = block.timestamp;

        emit PetInteracted(_tokenId, "play", pet.hunger, pet.happiness, pet.cleanliness);
    }

    function clean(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender, "Not your pet");
        (uint256 h, uint256 hap, uint256 c, uint256 health) = getPetStats(_tokenId);

        Pet storage pet = pets[_tokenId];
        pet.hunger = h;
        pet.happiness = hap;
        pet.cleanliness = _clamp(c + 25);
        pet.health = health;
        pet.lastInteraction = block.timestamp;

        emit PetInteracted(_tokenId, "clean", pet.hunger, pet.happiness, pet.cleanliness);
    }

    function _clamp(uint256 _val) internal pure returns (uint256) {
        return _val > 100 ? 100 : _val;
    }

    // Owner functions for customization
    function setDecayRates(uint256 _hunger, uint256 _happiness, uint256 _cleanliness) public onlyOwner {
        hungerDecayRate = _hunger;
        happinessDecayRate = _happiness;
        cleanlinessDecayRate = _cleanliness;
    }
}
