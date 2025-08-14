// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract JobsAndBids {
    enum JobStatus { Open, Accepted, Cancelled, Completed }

    struct Bid {
        uint256 id; 
        address bidder;
        uint256 amount;
        address token;
        string description;
        bool accepted;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Job {
        uint256 id;
        address creator;
        string description;
        JobStatus status;
        uint256 acceptedBidId;
        uint256 autoAcceptBidAmount; 
        address token;
        Bid[] bids;
        uint256 createdAt;
        uint256 updatedAt;
    }

    mapping(uint256 => Job) private jobs;
    uint256[] private jobIds; // To list jobs
    uint256 private jobCounter; // Incremental counter for job IDs

    event JobCreated(uint256 indexed jobId, address indexed creator, string description, uint256 createdAt);
    event BidPlaced(uint256 indexed jobId, uint256 indexed bidId, address indexed bidder, uint256 amount, address token, string description, uint256 createdAt);
    event BidAccepted(uint256 indexed jobId, uint256 indexed bidId, uint256 updatedAt);
    event JobCancelled(uint256 indexed jobId, uint256 updatedAt);
    event JobCompleted(uint256 indexed jobId, uint256 updatedAt);

    modifier onlyCreator(uint256 jobId) {
        require(msg.sender == jobs[jobId].creator, "Not job creator");
        _;
    }

    modifier jobExists(uint256 jobId) {
        require(jobs[jobId].creator != address(0), "Job does not exist");
        _;
    }

    function createJob(string calldata description, uint256 autoAcceptBidAmount, address token) external {
        jobCounter++;  // Increment counter

        uint256 jobId = jobCounter;

        Job storage newJob = jobs[jobId];
        newJob.id = jobId;
        newJob.creator = msg.sender;
        newJob.description = description;
        newJob.status = JobStatus.Open;
        newJob.acceptedBidId = type(uint256).max;
        newJob.autoAcceptBidAmount = autoAcceptBidAmount;
        newJob.token = token;
        newJob.createdAt = block.timestamp;
        newJob.updatedAt = block.timestamp;

        jobIds.push(jobId);

        emit JobCreated(jobId, msg.sender, description, block.timestamp);
    }

    function placeBid(uint256 jobId, uint256 amount, address token, string calldata description) external jobExists(jobId) {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Open, "Job is not open");
        require(msg.sender != job.creator, "Creator cannot bid");

        uint256 bidId = job.bids.length; 

        job.bids.push(Bid({
            id: bidId,
            bidder: msg.sender,
            amount: amount,
            token: token,
            description: description,
            accepted: false,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        }));
     

        emit BidPlaced(jobId, bidId, msg.sender, amount, token, description, block.timestamp);

        // Auto-accept logic
        if (job.autoAcceptBidAmount != 0 && amount <= job.autoAcceptBidAmount) {
            job.status = JobStatus.Accepted;
            job.acceptedBidId = bidId;
            job.bids[bidId].accepted = true;
            job.updatedAt = block.timestamp;

            emit BidAccepted(jobId, bidId, block.timestamp);
        }
    }

    function acceptBid(uint256 jobId, uint256 bidId) external jobExists(jobId) onlyCreator(jobId) {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Open, "Job is not open");
        require(bidId < job.bids.length, "Bid does not exist");

        job.status = JobStatus.Accepted;
        job.acceptedBidId = bidId;
        job.bids[bidId].accepted = true;
        job.updatedAt = block.timestamp;

        emit BidAccepted(jobId, bidId, block.timestamp);
    }

    function cancelJob(uint256 jobId) external jobExists(jobId) onlyCreator(jobId) {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Open, "Cannot cancel after accepting a bid");
        job.status = JobStatus.Cancelled;
        job.updatedAt = block.timestamp;

        emit JobCancelled(jobId,block.timestamp);
    }

    function completeJob(uint256 jobId) external jobExists(jobId) {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.Accepted, "Job must be accepted first");
        job.status = JobStatus.Completed;
        job.updatedAt = block.timestamp;

        emit JobCompleted(jobId,block.timestamp);
    }

    function getJob(uint256 jobId)
        external
        view
        jobExists(jobId)
        returns (
            uint256 id,
            address creator,
            string memory description,
            JobStatus status,
            uint256 acceptedBidId,
            uint256 autoAcceptBidAmount,
            uint256 createdAt,
            uint256 updatedAt
        )
    {
        Job storage job = jobs[jobId];
        return (job.id, job.creator, job.description, job.status, job.acceptedBidId, job.autoAcceptBidAmount, job.createdAt, job.updatedAt);
    }

    function getBids(uint256 jobId) external view jobExists(jobId) returns (Bid[] memory) {
        return jobs[jobId].bids;
    }

    function getJobCount() external view returns (uint256) {
        return jobIds.length;
    }

    function getJobIdAtIndex(uint256 index) external view returns (uint256) {
        require(index < jobIds.length, "Index out of bounds");
        return jobIds[index];
    }

    function getJobDetail(uint256 jobId)
        external
        view
        jobExists(jobId)
        returns (
            uint256 id,
            address creator,
            string memory description,
            JobStatus status,
            uint256 acceptedBidId,
            uint256 autoAcceptBidAmount,
            Bid[] memory bids,
            uint256 createdAt,
            uint256 updatedAt
        )
    {
        Job storage job = jobs[jobId];
        return (job.id, job.creator, job.description, job.status, job.acceptedBidId, job.autoAcceptBidAmount, job.bids,job.createdAt,job.updatedAt);
    }
}
