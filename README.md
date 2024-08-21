# WarriorsNFT :crossed_swords:
WarriorsNFT is a decentralized application that lets users mint unique warrior NFTs with randomized attributes and merge two NFTs to mint a higher rarity NFT. 
This project demonstrates NFT minting using the ERC721 standard and features a gacha-style minting system with merging capabilities. 

The project is built using React, Solidity, and Hardhat for smart contract development and testing. Bootstrap 5/Reactstrap is used for styling the front-end, creating a responsive user interface. The application interacts with Ethereum smart contracts to handle NFT minting and merging, while React manages the user experience.

## Table of Contents :scroll:
- [Features](#features-star)
- [Installation](#installation-hammer_and_wrench)
- [Usage](#usage-joystick)
- [Limitations & Future Improvements](#limitations--future-improvements-no_entry)
- [Process](#process-bulb)
- [FAQ](#faq-question)

## Features :star:
- **Minting NFTs**: Users can mint NFTs using a gacha system to determine the rarity and stats of the minted NFT.
- **Merging NFTs**: Two NFTs of the same rarity level can be merged/burned to mint a higher-rarity NFT.
- **Metadata Generation for NFT Series**:  Generate metadata for various NFT series to get new stats for the same NFT characters.

## Installation :hammer_and_wrench:
### Steps
1. **Clone the repository**:
    ```bash
    git clone git@github.com:amadzai/nft-mint-and-merge.git
    ```

   *or, if using HTTPS:*
    ```bash
    git clone https://github.com/amadzai/nft-mint-and-merge.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd nft-mint-and-merge
    ```

3. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Compile the smart contract**:
    ```bash
    npx hardhat compile
    ```

5. **Start a local blockchain**
    ```bash
    npx hardhat node
    ```

6. **Deploy the contract to the local network in a separate terminal**
    ```bash
    npx hardhat run scripts/deploy.cjs --network localhost
    ```

7. **Add contract address to src/components/Home.jsx**
    ```bash
    WarriorsNFT deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
    ```
    Replace the const contractAddress with your contractAddress

8. **Configure MetaMask**:  
    Add the local Hardhat network to MetaMask (usually running on http://localhost:8545) and import one of the accounts from the Hardhat node. You can use the private keys provided by Hardhat in the terminal.

9. **Start the front-end**:
    ```bash
    npm run dev
    ```
    Click to go to the Local URL

10. **Clear MetaMask activity data**:  
    Not required the first time if new account. After the first time, when network 
    is restarted, go to MetaMask -> Settings -> Advanced -> Clear activity tab data to prevent nonce error.

### Optional Steps
1. **Generate new metadata**:  
    ```bash
    node scripts/generateMetadata.js
    ```
    If you would like to add your own images and generate the new metadata, remove the current images from the metadata/images, add yours following the number.png format
    (e.g., 0.png), and the script will create a new folder in metadata/series. Adjust the metadata as needed in the script.

2. **Testnet Deployment**:  
    If you would like to deploy to a testnet, simply create a .env file in your root directory, and add the following information:
    ```
    POLYGON_AMOY_RPC_URL=[YOUR_RPC_URL] # Replace with the correct RPC URL
    ACCOUNT_PRIVATE_KEY=[YOUR_PRIVATE_KEY] # Replace with your MetaMask private key
    POLYGONSCAN_API_KEY=[YOUR_API_KEY] # Replace with your PolygonScan API key
    ```
    This will be using Polygon PoS chain on the Amoy testnet. Once set up, run:
    ```bash
    npx hardhat run scripts/deploy.cjs --network polygonAmoy
    ```
    Make sure your MetaMask account is connected to the Polygon Amoy network.

## Usage :joystick:
1. After setting up and navigating to the main page, please make sure MetaMask is on the correct Localhost network, and has no Activity:

<img src="./screenshots/1.png" alt="WarriorsNFT Home Page">

2. Mint an NFT by pressing the Mint button, this will use the gacha system to determine which NFT will be minted:

<img src="./screenshots/2.png" alt="WarriorsNFT Home Page after Minting">

Press the "Owned! Show URI" button to view the Metadata URI for that NFT.

3. To check if 2 minted NFTs can be merge, enter their IDs into the "Enter Token ID" input and boxes, and press the "Check Merge Eligibility" button:

<img src="./screenshots/3.png" alt="WarriorsNFT Home Page after checking merge">

Both NFTs must have already been minted and must be of the same rarity. 

4. Merge the eligible NFTs by pressing the "Merge and Mint New Token" button. This will burn the NFTs to mint a new NFT of a higher rarity. 

<img src="./screenshots/4.png" alt="WarriorsNFT Home Page after merging">

If all NFTs in that higher rarity has already been minted, the upgrade will jump to the next rarity, ultimately upgrading it twice. (e.g., Common -> Rare (if all minted) -> Epic)

5. All the burnt tokens used for merging can be seen below, as well as your balance after pressing the "Check Balance" button (minting is free but gas fee is still incurred):

<img src="./screenshots/5.png" alt="WarriorsNFT Home Page when checking burnt tokens and balance">

6. After all NFTs have been minted, the "Check Merge Eligibility" button will disappear, and there will be no more new Summon cards to mint. Currently, there is 18 total NFTs. Restart the network and clear the MetaMask activity data to use again.

## Limitations & Future Improvements :no_entry:
1. No backend implementation: Currently, all logic is handled on-chain and through the front-end.  
- Can be improved by adding API endpoints to mint, retrieve, and merge user NFTs that are connected with their wallets, as well as a database to store these data off-chain.

2. Simple single-page dapp: There is only one page as of now, with a simple UI and style.  
- Separate pages for minting, merging, viewing collection, and a guide displaying the gacha system and rarities will create a better user experience. 

3. Lack of smart contract tests: There is only one test script that is not robust, which only tests the payment and ownership of an NFT.  
- Can be improved by creating more smart contract test scripts that are able to test edge cases and all the different functionalities of the contract.

## Process :bulb:
1. Priorities:
- As this is my first time creating smart contracts, and with very little experience in JavaScript frameworks for both the front-end and back-end, the initial priorities based on what I believe I was capable of were:
  - Get the smart contract up-and-running.
  - Create a basic React front-end to test the minting of an NFT. 
  - Successfully mint an NFT where the image and metadata would be updated, and the state of the NFT is stored.
  - Implement a gacha system to randomly (based on probability) mint an NFTs based on their rarity.
  - Implement the merging/burning function that upgrades an NFT to a higher rarity.
  - Deploy the contracts on a testnet.
  - Add styling and additional pages to the front-end.
  - Implement the entire back-end logic.
- I was able to barely reach the the Add styling to the front-end stage, without adding any additional pages in the time given and with very simple styling. 

2. Tool Selection:
- As I was following Fireship's guide at the very start, which helped with getting the smart contract up-and-running, as well as creating a basic React front-end, I decided to stick with the same tools and technology from the guide as it would reduce further complexity of converting it to a different selection. Here are the tools and technologies:
  - React 
  - Bootstrap (Added Reactstrap later on)
  - Hardhat
  - OpenZeppelin (Adjusted the boilerplate later on)
  - Alchemy (For testnet deployment)

3. Challenges and Time Management:
- Initially, I underestimated the time required to implement features as I had a clear plan. When I began to work on successfully minting the NFT, a myriad of bugs and errors were thrown.
- A lot of time was needed to learn the necessary dependencies and setup (thanks Fireship), the Solidity syntax, and how NFTs are generated overall. As many of the beginner guides were from a few years back, it required a lot of debugging, researching, and ChatGPT (which also caused more bugs).
- The gacha and merging logic took most of the time (2 days), with every iteration creating new errors somewhere else. I decided not to jump to back-end when faced with failures in the gacha and merging logic as I would end up with more questions, and lose my train of thought. The commitment to solving gacha and merging logic ended up being my final successful implementation in the project within the given time frame. 
- I decided that completely implementing the Smart Contract Development with some Front-End Development would yield the most obvious results, and would be able to at least attain the title and key requirements of the project.

4. Key Takeaways:
- If given more time, I would definitely take a different approach in learning the tools and technology. Instead of following a deprecated guide, I would have slowly read through official documentations, and work on mini-projects to make sure I actually understand every line of code, and the flow of it. However, this would not be a good approach to a time-restricted project, especially with a lack of experience.
- Regardless of the time-constraint, this project provided hands-on experience with developing and deploying an ERC721 smart contract, where I gained a ton of insight on how minting, merging, and burning tokens work, which is something fundamental to building NFT-based dApps, and even Web3 as a whole.
- Working on the gacha mechanics made me further understand the consequences of randomizing things, and how important it is to understand what the effects are, for both the front-end and the back-end, as without proper implementation, things get wonky... 
- Another small takeaway is realizing that most randomizations are handled off-chain, as randomizing on-chain is also difficult. When uploading my images and metadat to the IPFS via Pinata, it was the first time I noticed that the "user-minted" may have already existed, and the image itself may not be randomized at the time of minting.
- Overall, it was very difficult, but also very fun. Truly learnt a lot, and I can't wait to work on it again. 

For my complete brain-dump documentation: 

## FAQ :question:
1. What are the rarities?
- There are 5 total rarities, with 4 Warriors in each except the Legendary rarity where there's only 2:
  - Common (Green)
  - Rare (Blue)
  - Epic (Purple)
  - Mythic (Red)
  - Legendary (Yellow)

2. What are the chances for each rarity?
- Below are the base rarities, as more NFTs are minted, the chances for each increase:
  - Common: 50%
  - Rare: 30%
  - Epic: 15%
  - Mythic: 8%
  - Legendary: 2%

3. Why does the 18th NFT sometimes fail to appear after minting?
- This issue may occur if the minting transaction is rejected multiple times or if the "Merge and Mint New Token" button is clicked multiple times in quick succession. To resolve this, restart your local blockchain network and clear MetaMask's activity data. After that, you should be able to mint successfully.