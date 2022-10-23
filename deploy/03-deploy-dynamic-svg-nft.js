const { network, ethers } = require("hardhat");
const {
    developmentChains,
    networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const fs = require("fs");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await ethers.getContract("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].usdEthPriceFeed;
    }

    const lowSVG = fs.readFileSync("./images/dynamicNft/frown.svg", {
        encoding: "utf8",
    });
    const highSVG = fs.readFileSync("./images/dynamicNft/happy.svg", {
        encoding: "utf8",
    });

    log("----------------------------------------------------");
    arguments = [ethUsdPriceFeedAddress, lowSVG, highSVG];
    const dynamicSvgNft = await deploy("DynamicSvgNft", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    // Verify the deployment
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...");
        await verify(dynamicSvgNft.address, arguments);
    }
};

module.exports.tags = ["all", "dynamicsvg", "main"];
