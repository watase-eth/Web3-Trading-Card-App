import { MediaRenderer, Web3Button, useAddress, useContract, useDirectListing, useNFT } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { CARD_ADDRESS, MARKETPLACE_ADDRESS } from "../const/addresses";

type Props = {
    tokenID: string;
    listingID: string;
};

export default function NFTCard({ tokenID, listingID }: Props) {
    const address = useAddress();

    const {
        contract: cardContract,
    } = useContract(CARD_ADDRESS, "edition");
    const {
        data: nft
    } = useNFT(cardContract, tokenID);

    const {
        contract: marketplace
    } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
    const {
        data: listing,
        isLoading: loadingListing
    } = useDirectListing(marketplace, listingID);
    console.log(listing);

    async function buyNFT() {
        let txResult;

        if (listing) {
            txResult = await marketplace?.directListings.buyFromListing(
                listing.id,
                1
            )
        } else {
            throw new Error("No valid listing found");
        }
            
        return txResult;
    };

    return (
        <div className={styles.nftCard}>
            <MediaRenderer
                src={nft?.metadata?.image}
                height="200px"
                width="200px"
            />
            <p className={styles.cardName}>{nft?.metadata?.name}</p>
            <p><strong>Price:</strong> {listing?.currencyValuePerToken.displayValue} {` ${listing?.currencyValuePerToken.symbol}`}</p>
            {!address ? (
                <p>Please login to buy</p>
            ) : (
                <Web3Button
                    contractAddress={MARKETPLACE_ADDRESS}
                    action={() => buyNFT()}
                    className={styles.buyButton}
                >Buy Now</Web3Button>
            )}
        </div>
    )
}