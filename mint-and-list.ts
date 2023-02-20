import { ethers } from "hardhat"

const PRICE = ethers.utils.parseEther("0.1")

async function mintAndList() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const basicNft = await ethers.getContract("BasicNft")
    console.log("Minting Nft_ _ _")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.events[0].args.tokenId
    console.log("Approving Nft_ _ _")
    const approveTx = await basicNft.approve(nftMarketplace.address, tokenId)
    await approveTx.wait(1)
    const tx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE)
    console.log("Listed!!!")
}

mintAndList()
    .then(async () => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
