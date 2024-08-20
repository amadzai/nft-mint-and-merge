import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the base directory for the metadata and image files
const metadata_base_dir = path.join(__dirname, '../metadata');
const images_dir = path.join(metadata_base_dir, 'images'); // Source folder for images

// Function to determine the next available series folder
function getNextSeriesFolder(base_dir) {
    let series_num = 1;
    while (true) {
        const series_folder = `series${series_num}`;
        const series_path = path.join(base_dir, series_folder);

        // Check if the series folder exists
        if (fs.existsSync(series_path)) {
            // Check if the folder has no JSON files
            const files = fs.readdirSync(series_path).filter(file => file.endsWith('.json'));
            if (files.length === 0) {
                return { series_folder, series_num, series_path };
            }
        } else {
            // If the folder doesn't exist, create it and use it
            fs.mkdirSync(series_path, { recursive: true });
            return { series_folder, series_num, series_path };
        }

        // Increment the series number and check the next folder
        series_num++;
    }
}

// Get the next available series folder
const { series_path } = getNextSeriesFolder(metadata_base_dir);

// List of warriors with their image names, rarities, and descriptions
const warriors = [
    {
        "image": '0.png',
        "name": 'Bjornulfr',
        "rarity": 'Common',
        "description": 'A Viking berserker, known for his fierce bravery and battle-worn armor.'
    },
    {
        "image": '1.png',
        "name": 'Li Xiu',
        "rarity": 'Common',
        "description": 'A skilled tactician from the elite battalion, renowned for her strategic prowess and combat finesse.'
    },
    {
        "image": '2.png',
        "name": 'Nitis',
        "rarity": 'Common',
        "description": 'A fearless fighter from the Apache, celebrated for their fierce combat skills and unyielding spirit'
    },
    {
        "image": '3.png',
        "name": 'Phlontar',
        "rarity": 'Common',
        "description": 'A valiant soldier of the Roman legions, distinguished by unwavering courage and stamina in battle.'
    },
    {
        "image": '4.png',
        "name": 'Fu Hao',
        "rarity": 'Rare',
        "description": 'A renowned general from ancient times, celebrated for exceptional strategic brilliance and martial skill.'
    },
    {
        "image": '5.png',
        "name": 'Plutonus',
        "rarity": 'Rare',
        "description": 'A distinguished Roman lieutenant, recognized for tactical acumen and leadership on the battlefield.'
    },
    {
        "image": '6.png',
        "name": 'Tecumseh',
        "rarity": 'Rare',
        "description": 'A revered Shawnee chieftain, known for his visionary leadership and fierce determination in uniting his people.'
    },
    {
        "image": '7.png',
        "name": 'Yoruichi',
        "rarity": 'Rare',
        "description": 'An esteemed archer from ancient Japan, known for unmatched accuracy and profound wisdom in the art of the bow.'
    },
    {
        "image": '8.png',
        "name": 'Guan Yu',
        "rarity": 'Epic',
        "description": 'A master of the halberd, celebrated for his formidable technique and approach to combat.'
    },
    {
        "image": '9.png',
        "name": 'Olesia',
        "rarity": 'Epic',
        "description": 'A fearless warrior from ancient Sparta, trained for battle from birth.'
    },
    {
        "image": '10.png',
        "name": 'Pang E',
        "rarity": 'Epic',
        "description": 'A skilled horse rider and staff fighter, known for her exceptional agility and combat expertise.'
    },
    {
        "image": '11.png',
        "name": 'Romulus',
        "rarity": 'Epic',
        "description": 'A heroic figure of ancient Rome, renowned for his legendary deeds and valor in battle.'
    },
    {
        "image": '12.png',
        "name": 'Ajax',
        "rarity": 'Mythic',
        "description": 'A heroic Greek warrior renowned for his immense strength and key role in epic battles.'
    },
    {
        "image": '13.png',
        "name": 'Atalanta',
        "rarity": 'Mythic',
        "description": 'A renowned Greek heroine celebrated for her unparalleled speed and skill in the hunt.'
    },
    {
        "image": '14.png',
        "name": 'Nagakado',
        "rarity": 'Mythic',
        "description": 'A commanding general known for his prowess in wielding a mace and staff while expertly riding into battle.'
    },
    {
        "image": '15.png',
        "name": 'Xun Guan',
        "rarity": 'Mythic',
        "description": 'A strategic Chinese general celebrated for her tactical brilliance and leadership in warfare.'
    },
    {
        "image": '16.png',
        "name": 'Emperor',
        "rarity": 'Legendary',
        "description": 'A god-emperor worshipped by all Warriors, words cannot describe his power.'
    },
    {
        "image": '17.png',
        "name": 'Empress',
        "rarity": 'Legendary',
        "description": 'A god-empress worshipped by all Warriors, words cannot describe her aura'
    },
];

// Function to generate a random stat based on rarity
function getRandomStat(rarity) {
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

// Generate metadata for each warrior, copy the image, and save as JSON files
warriors.forEach(warrior => {
    const metadata = {
        "name": warrior.name,
        "description": warrior.description,
        "image": warrior.image,  // Placeholder for IPFS hash, can be replaced later
        "attributes": [
            { "trait_type": "Rarity", "value": warrior.rarity },
            { "trait_type": "Attack", "value": getRandomStat(warrior.rarity) },
            { "trait_type": "Defense", "value": getRandomStat(warrior.rarity) }
        ]
    };

    // Save metadata as JSON files in the series directory
    const fileName = warrior.image.replace('.png', '.json');
    const filePath = path.join(series_path, fileName);
    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
    console.log(`Generated metadata for ${warrior.name} -> ${filePath}`);

    // Copy image from metadata/images to the series folder
    const imageSourcePath = path.join(images_dir, warrior.image);
    const imageDestPath = path.join(series_path, warrior.image);
    
    if (fs.existsSync(imageSourcePath)) {
        fs.copyFileSync(imageSourcePath, imageDestPath);
        console.log(`Copied image ${warrior.image} to ${series_path}`);
    } else {
        console.error(`Image ${warrior.image} not found in ${images_dir}`);
    }
});