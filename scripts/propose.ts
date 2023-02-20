import {
    developmentChains,
    proposalsFile,
    PROPOSAL_DESCRIPTION,
    VOTING_DELAY,
} from "./../helper-hardhat-config"
import { ethers, network } from "hardhat"
import { FUNC, NEW_STORE_VALUE } from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import fs from "fs"

export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")
    const encodeFunctionCall = box.interface.encodeFunctionData(functionToCall, args)
    console.log({ encodeFunctionCall })
    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
    console.log(`Proposal Description: \n ${proposalDescription}`)
    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodeFunctionCall],
        proposalDescription
    )
    const proposeReceipt = await proposeTx.wait(1)
    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1)
    }

    console.log(`Writing ProposalId to proposal file`, { proposeReceipt })
    const proposalId = proposeReceipt.events[0].args.proposalId
    let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))

    proposals[network.config.chainId!.toString()].push(proposalId.toString())
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals))
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
