import { Web3Button, useAddress, useContract, useCreateDirectListing } from "@thirdweb-dev/react";
import { NFT as NFTType } from "@thirdweb-dev/sdk";
import { CARD_ADDRESS, MARKETPLACE_ADDRESS } from "../const/addresses";
import { useForm } from "react-hook-form";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

type Props = {
    nft: NFTType;
};

type ListingFormData = {
    nftContractAddress: string;
    tokenId: string;
    price: string;
    startDate: Date;
    endDate: Date;
};

export const ListingInfo = ({ nft }: Props) => {
    const address = useAddress();
    const router = useRouter();

    const {
        contract: marketplace,
    } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");
    const {
        contract: nftCollection,
    } = useContract(CARD_ADDRESS);

    const {
        mutateAsync: createDirectListing
    } = useCreateDirectListing(marketplace);

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
            tokenId: nft?.metadata.id,
            price: "0",
            startDate: new Date(),
            endDate: new Date(),
        }
    });

    async function onSubmit(data: ListingFormData) {
        await checkAndProvideApproval();
        const txResult = await createDirectListing({
            assetContractAddress: data.nftContractAddress,
            tokenId: data.tokenId,
            pricePerToken: data.price,
            startTimestamp: new Date(data.startDate),
            endTimestamp: new Date(data.endDate),
        });
        
        return txResult;
    };

    return (
        <div className={styles.listingInfo}>
            <p>Start date:</p>
            <input
                type="datetime-local"
                {...register("startDate")}
            />
            <p>End date:</p>
            <input
                type="datetime-local"
                {...register("endDate")}
            />
            <p>Price:</p>
            <input
                type="number"
                step={0.01}
                {...register("price")}
            />
            <br />
            <Web3Button
                contractAddress={MARKETPLACE_ADDRESS}
                action={async () => {
                    await handleSubmit(onSubmit)();
                }}
                onSuccess={() => {
                    console.log("success");
                    router.push("/marketplace");
                }}
            >List for sale</Web3Button>
        </div>
    )
};