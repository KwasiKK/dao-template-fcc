import {
    developmentChains,
    MIN_DELAY,
    proposalsFile,
    PROPOSAL_DESCRIPTION,
    VOTING_PERIOD,
} from "./../helper-hardhat-config"
import { FUNC, NEW_STORE_VALUE } from "../helper-hardhat-config"
import { ethers, network } from "hardhat"
import { moveBlocks } from "../utils/move-blocks"
import fs from "fs"
import { moveTime } from "../utils/move-time"

const index = 0

export async function queueAndExecute(proposalIndex: number) {
    const args = [NEW_STORE_VALUE]
    const box = await ethers.getContract("Box")
    const encodeFunctionCall = box.interface.encodeFunctionData(FUNC, args)
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
    const governor = await ethers.getContract("GovernorContract")

    console.log(`Queueing Proposal`)

    const queueTx = await governor.queue([box.address], [0], [encodeFunctionCall], descriptionHash)
    await queueTx.wait(1)
    if (developmentChains.includes(network.name)) {
        await moveTime(MIN_DELAY + 1)
        await moveBlocks(1)
    }

    console.log(`Executinging Proposal`)
    const executeTx = await governor.execute(
        [box.address],
        [0],
        [encodeFunctionCall],
        descriptionHash
    )
    await executeTx.wait(1)

    const boxNewValue = await box.retrieve()
    console.log(`!!!! The new box value is ${boxNewValue.toString()} !!!!`)
}

queueAndExecute(index)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
