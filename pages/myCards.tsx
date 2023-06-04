import { ThirdwebNftMedia, useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { CARD_ADDRESS } from "../const/addresses";
import { useState } from "react";
import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import { ListingInfo } from "../components/ListingInfo";

export default function MyCards() {
    const address = useAddress();

    const {
        contract: nftCollection,
        isLoading: loadingNFTCollection
    } = useContract(CARD_ADDRESS, "edition");

    const {
        data: nfts,
        isLoading: loadingNFTs
    } = useOwnedNFTs(nftCollection, address);
    console.log(nfts);

    const [selectedNFT, setSelectedNFT] = useState<NFTType>();

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
};