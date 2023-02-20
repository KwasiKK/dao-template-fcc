import { developmentChains, proposalsFile, VOTING_PERIOD } from "./../helper-hardhat-config"
import { ethers, network } from "hardhat"
import { moveBlocks } from "../utils/move-blocks"
import fs from "fs"

const index = 0

export async function main(proposalIndex: number) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    const proposalId = proposals[network.config.chainId!][proposalIndex]
    const voteWay = 1
    const governor = await ethers.getContract("GovernorContract")
    const reason = "Summoning carbon entities"
    const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason)
    await voteTxResponse.wait(1)
    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }
    console.log("Voted! Let's Gooo")
}

main(index)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
