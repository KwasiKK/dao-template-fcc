import { ethers } from "hardhat"
import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { developmentChains } from "../helper-hardhat-config"
import verify from "../utils/verify"

const deployBox = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("Deploying-----------------------------------")
    const args = []
    const box = await deploy("Box", {
        from: deployer,
        args: args,
        logs: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    const timeLock = await ethers.getContract("TimeLock")
    const boxContract = await ethers.getContractAt("Box", box.address)
    const transferOwnerTx = await boxContract.transferOwnership(timeLock.address)
    transferOwnerTx.wait(1)

    log("--------------------YOU DID IT, FIRST DAO------------------------")
}

export default deployBox
deployBox.tags = ["all", "Box"]
