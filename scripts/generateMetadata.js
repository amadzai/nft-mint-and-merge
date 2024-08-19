const fs = require('fs');
const path = require('path');

// Define the base directory for the metadata files
const metadata_base_dir = './metadata/json';

// Function to determine the next series folder
function getNextSeriesFolder(base_dir) {
    let series_num = 1;
    while (true) {
        const series_folder = `series${series_num}`;
        const series_path = path.join(base_dir, series_folder);
        if (!fs.existsSync(series_path)) {
            return series_path;
        }
        series_num++;
    }
}

// Create the next available series folder
const series_dir = getNextSeriesFolder(metadata_base_dir);
fs.mkdirSync(series_dir, { recursive: true });

// List of warriors with their image names, rarities, and descriptions
const warriors = [
    {
        "image": 'bjornulfr.png',
        "name": 'Bjornulfr',
        "rarity": 'Common',
        "description": 'A Viking berserker, known for his fierce bravery and battle-worn armor.'
    },
    {
        "image": 'li_xiu.png',
        "name": 'Li Xiu',
        "rarity": 'Common',
        "description": 'A skilled tactician from the elite battalion, renowned for her strategic prowess and combat finesse.'
    },
    {
        "image": 'nitis.png',
        "name": 'Nitis',
        "rarity": 'Common',
        "description": 'A fearless fighter from the Apache, celebrated for their fierce combat skills and unyielding spirit'
    },
    {
        "image": 'phlontar.png',
        "name": 'Phlontar',
        "rarity": 'Common',
        "description": 'A valiant soldier of the Roman legions, distinguished by unwavering courage and stamina in battle.'
    },
    {
        "image": 'fu_hao.png',
        "name": 'Fu Hao',
        "rarity": 'Rare',
        "description": 'A renowned general from ancient times, celebrated for exceptional strategic brilliance and martial skill.'
    },
    {
        "image": 'plutonus.png',
        "name": 'Plutonus',
        "rarity": 'Rare',
        "description": 'A distinguished Roman lieutenant, recognized for tactical acumen and leadership on the battlefield.'
    },
    {
        "image": 'tecumseh.png',
        "name": 'Tecumseh',
        "rarity": 'Rare',
        "description": 'A revered Shawnee chieftain, known for his visionary leadership and fierce determination in uniting his people.'
    },
    {
        "image": 'yoruichi.png',
        "name": 'Yoruichi',
        "rarity": 'Rare',
        "description": 'An esteemed archer from ancient Japan, known for unmatched accuracy and profound wisdom in the art of the bow.'
    },
    {
        "image": 'guan_yu.png',
        "name": 'Guan Yu',
        "rarity": 'Epic',
        "description": 'A master of the halberd, celebrated for his formidable technique and approach to combat.'
    },
    {
        "image": 'olesia.png',
        "name": 'Olesia',
        "rarity": 'Epic',
        "description": 'A fearless warrior from ancient Sparta, trained for battle from birth.'
    },
    {
        "image": 'pang_e.png',
        "name": 'Pang E',
        "rarity": 'Epic',
        "description": 'A skilled horse rider and staff fighter, known for her exceptional agility and combat expertise.'
    },
    {
        "image": 'romulus.png',
        "name": 'Romulus',
        "rarity": 'Epic',
        "description": 'A heroic figure of ancient Rome, renowned for his legendary deeds and valor in battle.'
    },
    {
        "image": 'ajax.png',
        "name": 'Ajax',
        "rarity": 'Mythic',
        "description": 'A heroic Greek warrior renowned for his immense strength and key role in epic battles.'
    },
    {
        "image": 'atalanta.png',
        "name": 'Atalanta',
        "rarity": 'Mythic',
        "description": 'A renowned Greek heroine celebrated for her unparalleled speed and skill in the hunt.'
    },
    {
        "image": 'nagakado.png',
        "name": 'Nagakado',
        "rarity": 'Mythic',
        "description": 'A commanding general known for his prowess in wielding a mace and staff while expertly riding into battle.'
    },
    {
        "image": 'xun_guan.png',
        "name": 'Xun Guan',
        "rarity": 'Mythic',
        "description": 'A strategic Chinese general celebrated for her tactical brilliance and leadership in warfare.'
    },
    {
        "image": 'emperor.png',
        "name": 'Emperor',
        "rarity": 'Legendary',
        "description": 'A god-emperor worshipped by all Warriors, words cannot describe his power.'
    },
    {
        "image": 'empress.png',
        "name": 'Empress',
        "rarity": 'Legendary',
        "description": 'A god-empress worshipped by all Warriors, words cannot describe her aura'
    },
];

// Function to generate a random stat based on rarity
function getRandomStat(rarity, statType) {
    let min, max;

    // Define ranges for different rarities
    switch (rarity) {
        case 'Common':
            min = 10;
            max = 40;
            break;
        case 'Rare':
            min = 41;
            max = 60;
            break;
        case 'Epic':
            min = 61;
            max = 80;
            break;
        case 'Mythic':
            min = 81;
            max = 90;
            break;
        case 'Legendary':
            min = 91;
            max = 100;
            break;
        default:
            min = 10;
            max = 100;  // Default case if no rarity matches
    }

    // Generate random number based on the range
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate metadata for each warrior and save as JSON files
warriors.forEach(warrior => {
    const metadata = {
        "name": warrior.name,
        "description": warrior.description,
        "image": `ipfs://<IPFS_HASH_FOR_IMAGE_${warrior.image}>`,
        "attributes": [
            { "trait_type": "Rarity", "value": warrior.rarity },
            { "trait_type": "Attack", "value": getRandomStat(warrior.rarity, 'Attack') },
            { "trait_type": "Defense", "value": getRandomStat(warrior.rarity, 'Defense') }
        ]
    };

    // Save metadata as JSON files in the series directory
    const fileName = `${series_dir}/${warrior.name.toLowerCase()}.json`;
    fs.writeFileSync(fileName, JSON.stringify(metadata, null, 2));
    console.log(`Generated metadata for ${warrior.name} -> ${fileName}`);
});
