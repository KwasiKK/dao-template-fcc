import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { developmentChains } from "../helper-hardhat-config"
import { VOTING_PERIOD, VOTING_DELAY, QUORUM_PERCENTAGE } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const deployGovernorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const governanceToken = await get("GovernanceToken")
    const timeLock = await get("TimeLock")

    log("----------------------------------------------------")
    log("Deploying GovernorContract and waiting for confirmations...")

    const args = [
        governanceToken.address,
        timeLock.address,
        VOTING_DELAY,
        VOTING_PERIOD,
        QUORUM_PERCENTAGE,
    ]

    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: 1,
    })
    log(`GovernorContract at address ${governorContract.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(governorContract.address, [])
    }
}

export default deployGovernorContract
