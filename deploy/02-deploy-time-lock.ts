import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { developmentChains } from "../helper-hardhat-config"
import { MIN_DELAY } from "../helper-hardhat-config"

const deployTimeLock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("----------------------------------------------------")
    log("Deploying TimeLock and waiting for confirmations...")

    const args = [MIN_DELAY, [], [], deployer]

    const governanceToken = await deploy("TimeLock", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: 1,
    })
    log(`TimeLock at address ${governanceToken.address}`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(governanceToken.address, [])
    }
}

export default deployTimeLock
