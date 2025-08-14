# JobsAndBids Smart Contract

A decentralized job marketplace built on Ethereum (or any EVM-compatible blockchain) where job creators can post jobs and bidders can place bids. Jobs can have **auto-accept bid thresholds** and track the lifecycle from **Open → Accepted → Completed/Cancelled**.

## Features

- **Create Jobs** — Any address can create a new job with a description, token type, and optional auto-accept bid amount.
- **Place Bids** — Any address (except the job creator) can bid on open jobs with a bid description, amount, and token address.
- **Auto-Accept Bids** — If a bid amount is less than or equal to the auto-accept threshold, the bid is automatically accepted.
- **Manually Accept Bids** — The job creator can accept any bid while the job is open.
- **Cancel Jobs** — Job creators can cancel jobs before accepting any bid.
- **Complete Jobs** — Mark accepted jobs as completed.
- **View Functions** — Retrieve job details, bids, and listing info.

## Contract Details

- **Solidity Version**: `^0.8.20`
- **License**: MIT
- **Enums**:
  - `JobStatus`: `Open`, `Accepted`, `Cancelled`, `Completed`
- **Structs**:
  - `Bid`: Stores bid details (bidder, amount, token, description, timestamps).
  - `Job`: Stores job details, accepted bids, bids array, and timestamps.
- **Events**:
  - `JobCreated`
  - `BidPlaced`
  - `BidAccepted`
  - `JobCancelled`
  - `JobCompleted`

## Functions

### Job Management
- `createJob(string description, uint256 autoAcceptBidAmount, address token)`
- `cancelJob(uint256 jobId)`
- `completeJob(uint256 jobId)`

### Bidding
- `placeBid(uint256 jobId, uint256 amount, address token, string description)`
- `acceptBid(uint256 jobId, uint256 bidId)`

### Getters
- `getJob(uint256 jobId)`
- `getBids(uint256 jobId)`
- `getJobCount()`
- `getJobIdAtIndex(uint256 index)`
- `getJobDetail(uint256 jobId)`

## Deployment

### Using Hardhat
```bash
# Install dependencies
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers

# Compile contract
npx hardhat compile

# Deploy script (example)
const hre = require("hardhat");

async function main() {
  const JobsAndBids = await hre.ethers.getContractFactory("JobsAndBids");
  const jobsAndBids = await JobsAndBids.deploy();
  await jobsAndBids.deployed();
  console.log("JobsAndBids deployed to:", jobsAndBids.address);
}

main();
