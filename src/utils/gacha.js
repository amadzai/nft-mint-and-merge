const metadataMap = {
    'Common': ['0', '1', '2', '3'],  // List of common warrior token IDs
    'Rare': ['4', '5', '6', '7'],    // List of rare warrior token IDs
    'Epic': ['8', '9', '10', '11'],  // List of epic warrior token IDs
    'Mythic': ['12', '13', '14', '15'],  // List of mythic warrior token IDs
    'Legendary': ['16', '17']        // List of legendary warrior token IDs
};

// Track minted tokens
const mintedTokens = new Set();

export function selectWarrior() {
    const warriors = [
        { name: 'Common', probability: 50, start: 0, end: 49 },
        { name: 'Rare', probability: 30, start: 50, end: 79 },
        { name: 'Epic', probability: 15, start: 80, end: 94 },
        { name: 'Mythic', probability: 8, start: 95, end: 98 },
        { name: 'Legendary', probability: 2, start: 99, end: 100 }
    ];

    const randomNum = Math.floor(Math.random() * 101);

    const selectedWarrior = warriors.find(warrior =>
        randomNum >= warrior.start && randomNum <= warrior.end
    );

    return selectedWarrior.name;
}

// Check if all tokens for a rarity have been minted
function areAllTokensMintedForRarity(rarity) {
    const tokens = metadataMap[rarity];
    if (!tokens || tokens.length === 0) return true;
    
    return tokens.every(token => mintedTokens.has(token));
}

// Get a token for the selected rarity or re-roll if all are minted
export function getTokenIdForWarrior(rarity) {
    let tokens = metadataMap[rarity];

    if (!tokens || tokens.length === 0 || areAllTokensMintedForRarity(rarity)) {
        console.error(`All tokens for rarity: ${rarity} have been minted. Re-rolling.`);
        return null;  // Return null to trigger re-roll in the main function
    }

    let randomIndex;
    let token;

    do {
        randomIndex = Math.floor(Math.random() * tokens.length);
        token = tokens[randomIndex];
    } while (mintedTokens.has(token));

    mintedTokens.add(token);

    console.log(`Selected token index for ${rarity}: ${randomIndex}, token: ${token}`);
    return token;
}

// Optionally, you can export a reset function for testing
// export function resetMintedTokens() {
//     mintedTokens.clear();
// }