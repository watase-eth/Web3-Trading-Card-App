import { ThirdwebNftMedia, useContract, useNFT } from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import styles from "../styles/Home.module.css";
import { CARD_ADDRESS } from "../const/addresses";

type Props = {
    reward: {
        tokenId: string | number | bigint | BigNumber;
        contractAddress: string;
        quantityPerReward: string | number | bigint | BigNumber;
    };
};

export const PackRewardCard = ({ reward }: Props) => {
    const { contract } = useContract(CARD_ADDRESS, "edition");
    const { data } = useNFT(contract, reward.tokenId);
    
    return (
        <div className={styles.nftCard}>
            {data && (
                <>
                    <ThirdwebNftMedia
                        metadata={data.metadata}
                        height="200px"
                        width="200px"
                    />
                    <h3>{data.metadata.name}</h3>
                </>
            )}
        </div>
    )
};