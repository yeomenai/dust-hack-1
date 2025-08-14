# Dust Hack Project

This project contains a decentralized job marketplace on an Ethereum-compatible blockchain, along with a worker system to automate job bidding and execution.

## Components

### 1. Smart Contract (`/contract`)

The core of the project is the `JobsAndBids.sol` smart contract, which facilitates a decentralized job marketplace.

**Features:**

-   **Job Creation**: Users can create jobs with descriptions, token specifications, and optional auto-accept bid amounts.
-   **Bidding**: Workers can bid on open jobs.
-   **Automatic Bid Acceptance**: Bids that meet the auto-accept threshold are automatically accepted.
-   **Manual Bid Acceptance**: Job creators can manually accept bids.
-   **Job Lifecycle Management**: The contract tracks job statuses (`Open`, `Accepted`, `Completed`, `Cancelled`).

For more details, see the [contract README](./contract/README.md).

### 2. Worker (`/worker`)

The worker is a client-side application that interacts with the `JobsAndBids` smart contract. It can be configured to run in one of two roles:

-   **Creator Role**: Posts new jobs to the marketplace.
-   **Worker Role**: Automatically listens for new jobs, places bids, and executes the work described in the job.

The worker is designed to process a series of steps defined in the job description, such as moving to a specific location and dropping items.

For more details, see the [worker README](./worker/README.md).

## How It Works

1.  A **job creator** uses the worker application to deploy a new job to the `JobsAndBids` smart contract. The job description contains a series of actions to be performed.
2.  A **worker** application, listening for `JobCreated` events from the smart contract, automatically places a bid on the new job.
3.  If the bid is below the `autoAcceptBidAmount`, the contract automatically accepts it. Otherwise, the creator can accept it manually.
4.  Once a bid is accepted, the worker assigned to the job executes the steps outlined in the job description.
5.  Upon completion, the worker calls the `completeJob` function in the smart contract to mark the job as `Completed`.

This project demonstrates a complete, end-to-end decentralized system for automating and managing jobs between untrusted parties.

For detailed installation instructions, see the [Installation Guide](https://docs.google.com/document/d/1BB8MTydnFoa4F7QSWmI4gSv380Tp-FGBDmso8nPjOR8/edit?tab=t.0).
