import { ThirdwebNftMedia, Web3Button, useAddress, useContract, useCreateDirectListing, useOwnedNFTs } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { CARD_ADDRESS, MARKETPLACE_ADDRESS } from "../const/addresses";
import { useState } from "react";
import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import { useForm } from "react-hook-form";
import { ListingInfo } from "../components/ListingInfo";

type ListingFormData = {
    nftContractAddress: string;
    tokenId: string;
    price: string;
    startDate: Date;
    endDate: Date;
};

export default function MyCards() {
    const address = useAddress();

    const {
        contract: marketplace,
    } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
    const {
        contract: nftCollection,
        isLoading: loadingNFTCollection
    } = useContract(CARD_ADDRESS, "edition");

    const {
        data: nfts,
        isLoading: loadingNFTs
    } = useOwnedNFTs(nftCollection, address);
    console.log(nfts);

    const { mutateAsync: createDirectListing } = useCreateDirectListing(marketplace);

    const [selectedNFT, setSelectedNFT] = useState<NFTType>();

    async function checkAndProvideApproval() {
        const hasApproval = await nftCollection?.call(
            "isApprovedForAll",
            [address!, MARKETPLACE_ADDRESS]
        );

        if (!hasApproval) {
            const txResult = await nftCollection?.call(
                "setApprovalForAll",
                [MARKETPLACE_ADDRESS, true]
            );

            if (txResult) {
                console.log(txResult);
            }
        }

        return true;
    };

    const { register, handleSubmit } = useForm<ListingFormData>({
        defaultValues: {
            nftContractAddress: CARD_ADDRESS,
            tokenId: selectedNFT?.metadata.id,
            price: "0",
            startDate: new Date(),
            endDate: new Date(),
        },
    });
    
    async function listCard(data: ListingFormData) {
        await checkAndProvideApproval();
        const txResult = await createDirectListing({
            assetContractAddress: data.nftContractAddress,
            tokenId: data.tokenId,
            pricePerToken: data.price,
            startTimestamp: new Date(),
            endTimestamp: new Date(),
        });
    }

    


    return (
        <div className={styles.container}>
            <h1>My Cards</h1>
            <div className={styles.grid}>
                {!selectedNFT ? (
                    !loadingNFTCollection && !loadingNFTs ? (
                        nfts?.map((nft, index) => (
                            <div key={index} className={styles.nftCard}>
                                <ThirdwebNftMedia
                                    metadata={nft.metadata}
                                />
                                <div className={styles.myCardInfo}>
                                    <h3>{nft.metadata.name}</h3>
                                    <p>Qty: {nft.quantityOwned}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedNFT(nft)}
                                    className={styles.saleButton}
                                >Sell Card</button>
                            </div>
                        ))
                    ) :(
                        <p>Loading...</p>
                    )
                ) : (
                    <div className={styles.saleCard}>
                        <div>
                            <button
                                onClick={() => setSelectedNFT(undefined)}
                            >Back</button>
                            <br />
                            <ThirdwebNftMedia
                                metadata={selectedNFT.metadata}
                            />  
                        </div>
                        <div>
                            <p>List card for sale</p>
                            <ListingInfo nft={selectedNFT} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}