import { ADDRESS_ZERO } from "./../helper-hardhat-config"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../helper-functions"
import { developmentChains } from "../helper-hardhat-config"
import { VOTING_PERIOD, VOTING_DELAY, QUORUM_PERCENTAGE } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const setupGovernanceContracta: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const governanceToken = await ethers.getContract("GovernanceToken")
    const timeLock = await ethers.getContract("TimeLock")
    const governor = await ethers.getContract("GovernorContract")

    log("-----------------Setting up roles---------------")
    const proposerRole = await timeLock.PROPOSER_ROLE()
    const executorRole = await timeLock.EXECUTOR_ROLE()
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

    const proposerTx = await timeLock.grantRole(proposerRole, governor.address)
    await proposerTx.wait(1)
    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)
    await executorTx.wait(1)
    const revokeTx = await timeLock.revokeRole(adminRole, deployer)
    await revokeTx.wait(1)
}

export default setupGovernanceContracta
