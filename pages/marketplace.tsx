import { useContract, useValidDirectListings } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { CARD_ADDRESS, MARKETPLACE_ADDRESS } from "../const/addresses";
import NFTCard from "../components/NFT";

export default function Marketplace() {
    const {
        contract: marketplace
    } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
    const {
        data: directListings,
        isLoading: loadingDirectListings,
    } = useValidDirectListings(
        marketplace,
        {
            tokenContract: CARD_ADDRESS,
        }
    )

    return (
        <div className={styles.container}>
            <h1>Marketplace</h1>
            <div className={styles.grid}>
                {!loadingDirectListings ? (
                    directListings?.map((listing, index) => (
                        <div key={index}>
                            <NFTCard
                                tokenID={listing.asset.id}
                                listingID={listing.id}
                            />
                        </div>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    )
}