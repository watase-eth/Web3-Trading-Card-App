import { ThirdwebSDK } from "@thirdweb-dev/sdk"

import dotenv from "dotenv";
dotenv.config();

(async () => {
    const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "mumbai");

    const packAddress = "0xCf31dC000D76fbD1cc68760E577B17be7243dD34";
    const cardAddress = "0xF810082B4FaC42d65156Da88D5212dfAA75D0117";

    const pack = sdk.getContract(packAddress, "pack");

    const card = sdk.getContract(cardAddress, "edition");
    await (await card).setApprovalForAll(packAddress, true);
    console.log("Approved card contract to transfer cards to pack contract");

    const packImage = "ipfs://QmZkxBk58g1y6uYrRtS9GA1PqxdyZ6ehJQZTvZBchsGGvZ/pack.jpg";

    console.log("Creating pack");
    const createPacks = (await pack).create({
        packMetadata: {
            name: "Pack 2",
            description: "A new card pack",
            image: packImage,
        },
        erc1155Rewards: [
            {
                contractAddress: cardAddress,
                tokenId: 10,
                quantityPerReward: 1,
                totalRewards: 5,
            },
            {
                contractAddress: cardAddress,
                tokenId: 11,
                quantityPerReward: 1,
                totalRewards: 5,
            },
            {
                contractAddress: cardAddress,
                tokenId: 12,
                quantityPerReward: 1,
                totalRewards: 5,
            },
            {
                contractAddress: cardAddress,
                tokenId: 13,
                quantityPerReward: 1,
                totalRewards: 5,
            },
            {
                contractAddress: cardAddress,
                tokenId: 14,
                quantityPerReward: 1,
                totalRewards: 5,
            },
        ],
        rewardsPerPack: 1,
    });

    console.log("Packs created");
})();