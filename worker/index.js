(async () => {
    try {
        importScripts(`${self.location.origin}/libraries/yeomenAIBundle/bundle.js`);
        importScripts(`${self.location.origin}/projects/dustproject/services.js`);
        importScripts(`${self.location.origin}/libraries/ethers6.umd.min.js`);

        let role = formFields['role'] || null;

        let appData = formFields['appData'] || null;


        let eventEmitter = new EventEmitter();

        const { createPublicClient, decodeAbiParameters, http, decodeEventLog, hexToBytes, encodeFunctionData, getAbiItem, parseEther, estimateGas, getGasPrice } = YeomenAIBundle.viem;

        const chain = {
            id: 690,
            name: 'redstone',
            rpcUrls: {
                default: { http: ["https://rpc.redstonechain.com"] },
            },
            blockExplorers: {
                default: { url: "https://explorer.redstone.xyz", name: "redstone" },
            },
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 }
        };

        const clientOptions = {
            chain: chain,
            transport: http(),
            pollingInterval: 1000
        };

        const publicClient = createPublicClient(clientOptions);

        const contract = {
            address: '0x71104253ac79804ddaffdd39300007335d97e8a9',
            abi: [
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "jobId",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "bidId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "updatedAt",
                            "type": "uint256"
                        }
                    ],
                    "name": "BidAccepted",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "jobId",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "bidId",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "bidder",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "createdAt",
                            "type": "uint256"
                        }
                    ],
                    "name": "BidPlaced",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "jobId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "updatedAt",
                            "type": "uint256"
                        }
                    ],
                    "name": "JobCancelled",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "jobId",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "updatedAt",
                            "type": "uint256"
                        }
                    ],
                    "name": "JobCompleted",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "jobId",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "creator",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "createdAt",
                            "type": "uint256"
                        }
                    ],
                    "name": "JobCreated",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "jobId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "bidId",
                            "type": "uint256"
                        }
                    ],
                    "name": "acceptBid",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "jobId",
                            "type": "uint256"
                        }
                    ],
                    "name": "cancelJob",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "jobId",
                            "type": "uint256"
                        }
                    ],
                    "name": "completeJob",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "autoAcceptBidAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        }
                    ],
                    "name": "createJob",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "jobId",
                            "type": "uint256"
                        }
                    ],
                    "name": "getBids",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "id",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "address",
                                    "name": "bidder",
                                    "type": "address"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amount",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "address",
                                    "name": "token",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "description",
                                    "type": "string"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "accepted",
                                    "type": "bool"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "createdAt",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "updatedAt",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct JobsAndBids.Bid[]",
                            "name": "",
                            "type": "tuple[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "jobId",
                            "type": "uint256"
                        }
                    ],
                    "name": "getJob",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "creator",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "enum JobsAndBids.JobStatus",
                            "name": "status",
                            "type": "uint8"
                        },
                        {
                            "internalType": "uint256",
                            "name": "acceptedBidId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "autoAcceptBidAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "createdAt",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "updatedAt",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getJobCount",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "jobId",
                            "type": "uint256"
                        }
                    ],
                    "name": "getJobDetail",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "creator",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        },
                        {
                            "internalType": "enum JobsAndBids.JobStatus",
                            "name": "status",
                            "type": "uint8"
                        },
                        {
                            "internalType": "uint256",
                            "name": "acceptedBidId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "autoAcceptBidAmount",
                            "type": "uint256"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "id",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "address",
                                    "name": "bidder",
                                    "type": "address"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "amount",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "address",
                                    "name": "token",
                                    "type": "address"
                                },
                                {
                                    "internalType": "string",
                                    "name": "description",
                                    "type": "string"
                                },
                                {
                                    "internalType": "bool",
                                    "name": "accepted",
                                    "type": "bool"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "createdAt",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "updatedAt",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct JobsAndBids.Bid[]",
                            "name": "bids",
                            "type": "tuple[]"
                        },
                        {
                            "internalType": "uint256",
                            "name": "createdAt",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "updatedAt",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "index",
                            "type": "uint256"
                        }
                    ],
                    "name": "getJobIdAtIndex",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "jobId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "description",
                            "type": "string"
                        }
                    ],
                    "name": "placeBid",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]
        };

        const executeContractFunction = async (method, params, successMessage, errorMessage) => {
            try {

                if (!contract) throw new Error('Contract not found');

                const accountAddress = (YeomenAI.ACCOUNT.address).toLowerCase();

                // 1️⃣ Encode function call using viem
                const data = encodeFunctionData({
                    abi: contract.abi,
                    functionName: method, // here we can use actual method name instead of "executeTyped"
                    args: params
                });

                // 2️⃣ Get nonce from Yeomen
                const nonce = await YeomenAI.getNonce({ chain, address: accountAddress });

                // 3️⃣ Estimate gas via Yeomen or provider
                const gasEstimate = await publicClient.estimateGas({
                    to: contract.address,
                    from: accountAddress,
                    data
                });

                // 4️⃣ Get gas price from viem
                const gasPrice = await publicClient.getGasPrice();

                // 5️⃣ Build transaction
                const preparedTx = {
                    type: 0,
                    to: contract.address,
                    data,
                    chainId: chain.id,
                    gas: gasEstimate + 20000n,
                    gasPrice: gasPrice ?? 1000000000n,
                    nonce: BigInt(nonce),
                    value: 0n
                };

                console.log(preparedTx);

                // 6️⃣ Sign & send via Yeomen
                const txResponse = await YeomenAI.signBroadcastTransaction({
                    tx: preparedTx,
                    chain,
                    abi: contract.abi
                });

                console.log("Transaction sent! Hash:", txResponse);

                // 7️⃣ Wait for confirmation
                const receipt = await publicClient.waitForTransactionReceipt({ hash: txResponse });

                if (receipt.status === 'success') {
                    YeomenAI.statusMessage(successMessage, YeomenAI.MESSAGE_TYPES.SUCCESS);
                    return [true, txResponse];
                } else {
                    throw new Error(`Transaction reverted on-chain. See: ${txResponse}`);
                }

            } catch (err) {
                YeomenAI.statusMessage(`${errorMessage}: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                return [false, err];
            }
        };

        function mapResultToObject(abi, functionName, resultArray) {
            // Find the function in ABI
            const fn = abi.find(
                (item) =>
                    item.type === 'function' &&
                    item.name === functionName
            );

            if (!fn) throw new Error(`Function ${functionName} not found in ABI`);

            const outputs = fn.outputs || [];
            const obj = {};

            outputs.forEach((output, index) => {
                obj[output.name || `output${index}`] = resultArray[index];
            });

            return obj;
        }

        async function getJobDetail(jobId) {
            let job = await publicClient.readContract({
                address: contract.address,
                abi: contract.abi,
                functionName: 'getJobDetail',
                args: [jobId]
            });

            job = mapResultToObject(contract.abi, 'getJobDetail', job);

            return job;
        }

        async function displayStats() {


            const { job } = stats;


            let markdown = `\n`;

            markdown += `**Role:** ${stats.role}\n`;

            if (job) {
                markdown += `\n`;
                markdown += `#### 📝 Job Details\n`;
                markdown += `**ID:** ${job.id}\n`;
                markdown += `**Creator:** ${job.creator}\n`;
                markdown += `**Description:** ${job.description}\n`;
                markdown += `**Status:** ${job.status}\n`;
                markdown += `**Created At:** ${new Date(Number(job.createdAt) * 1000).toLocaleString("en-GB", { timeZone: "Europe/London" })}\n`;
                markdown += `**Updated At:** ${new Date(Number(job.updatedAt) * 1000).toLocaleString("en-GB", { timeZone: "Europe/London" })}\n`;

                if (job.bids && job.bids.length > 0) {
                    markdown += `\n##### 💰 Bids (${job.bids.length})\n`;
                    markdown += `| # | Bidder | Amount | Token | Description | Accepted | Created At | Updated At |\n`;
                    markdown += `|---|--------|--------|-------|-------------|----------|------------|------------|\n`;

                    job.bids.forEach((bid, i) => {
                        markdown += `| ${i + 1} | ${bid.bidder} | ${bid.amount} | ${bid.token} | ${bid.description} | ${bid.accepted ? "✅" : "❌"} | ${new Date(Number(bid.createdAt) * 1000).toLocaleString("en-GB", { timeZone: "Europe/London" })} | ${new Date(Number(bid.updatedAt) * 1000).toLocaleString("en-GB", { timeZone: "Europe/London" })} |\n`;
                    });
                } else {
                    markdown += `\n_No bids yet._\n`;
                }
            }

            await YeomenAI.markdown(markdown);
        }

        async function getPlayerCurrentPosition() {

            let playerCurrentPositionRecord = await DustprojectYeomen.getEntityPositionRecord(playerEntityId);

            let currentPositionCoord = { x: playerCurrentPositionRecord.x, y: playerCurrentPositionRecord.y, z: playerCurrentPositionRecord.z };

            console.log('currentPositionCoord', currentPositionCoord)

            return currentPositionCoord;
        }


        async function getPlayerInventories(playerEntityId) {

            const inventories = [];

            for (let slot = 0; slot < 36; slot++) {

                const encodedKey = encodeAbiParameters(
                    [
                        { name: "owner", type: "bytes32" },
                        { name: "slot", type: "uint16" }
                    ],
                    [playerEntityId, slot]
                );

                const slotData = getComponentValue(components.InventorySlot, encodedKey);

                if (slotData) {
                    inventories.push({
                        owner: playerEntityId,
                        slot,
                        ...slotData
                    });
                }
            }

            return inventories;
        }


        // contract.abi
        //     .filter(item => item.type === 'event')
        //     .forEach(evt => {
        //         publicClient.watchEvent({
        //             address: contract.address,
        //             abi: contract.abi,
        //             eventName: evt.name,
        //             onLogs: (logs) => {
        //                 logs.forEach(log => {
        //                     console.log(`📢 Event: ${log.eventName}`, log.args);
        //                     eventEmitter.emit(log.eventName, log.args);
        //                 });
        //             }
        //         });
        //     });

        let lastBlock = await publicClient.getBlockNumber();
        setInterval(async () => {
            const currentBlock = await publicClient.getBlockNumber();

            if (currentBlock > lastBlock) {
                const logs = await publicClient.getLogs({
                    address: contract.address,
                    abi: contract.abi,
                    fromBlock: lastBlock + 1n,  // start after last processed block
                    toBlock: currentBlock
                });

                logs.forEach(log => {
                    const decoded = decodeEventLog({
                        abi: contract.abi,
                        data: log.data,
                        topics: log.topics
                    });
                    //console.log('event', decoded)
                    console.log(`📢 Event: ${decoded.eventName}`, decoded.args);
                    eventEmitter.emit(decoded.eventName, decoded.args);
                });

                lastBlock = currentBlock; // update tracker
            }
        }, 5000);


        YeomenAI.statusMessage('Fetching player and position');
        const playerAddress = YeomenAI.ACCOUNT.delegator || YeomenAI.ACCOUNT.address;

        console.log('playerAddress', playerAddress)
        const playerAddressEncoded = DustprojectYeomen.gameHelper.encodePlayer({ address: playerAddress });
        const playerEntityId = playerAddressEncoded.entityId;
        console.log('playerEntityId', playerEntityId)


        let stats = {
            role: role,
            job: null
        };

        await displayStats();

        let jobId;
        if (role == 'creator') {

            if (!jobId) {
                let promptData;
                appData = (() => { try { return JSON.parse(appData); } catch (err) { console.log('appData error', err); return appData; } })();

                if (appData['description'] && appData['tokenAddress']) {
                    promptData = {
                        description: appData['description'],
                        autoAcceptBidAmount: 10,
                        token: appData['tokenAddress']
                    }
                } else {
                    YeomenAI.statusMessage(`Create your job.`, YeomenAI.MESSAGE_TYPES.INFO);

                    promptData = await YeomenAI.prompt([
                        {
                            type: 'text',
                            id: 'description',
                            label: 'Job Description',
                            placeholder: 'Enter job description',
                            required: true
                        },
                        {
                            type: 'number',
                            id: 'autoAcceptBidAmount',
                            label: 'Auto Accept Bid Amount',
                            placeholder: 'Enter amount',
                            required: true
                        },
                        {
                            type: 'text',
                            id: 'token',
                            label: 'Token Address',
                            placeholder: '0x0000000000000000000000000000000000000000',
                            required: true
                        },
                        {
                            type: 'submit',
                            id: 'create',
                            label: 'Create Job'
                        }
                    ]);
                }
                console.log('promptData', promptData)

                let [jobCreated, jobCreatedResponse] = await executeContractFunction(
                    'createJob',
                    [promptData['description'], promptData['autoAcceptBidAmount'], promptData['token']],
                    `Successfully created job`,
                    `Failed to create job`
                );

                if (jobCreated) {
                    console.log('jobCreatedResponse', jobCreatedResponse)


                    const receipt = await publicClient.waitForTransactionReceipt({ hash: jobCreatedResponse });
                    console.log('receipt', receipt);

                    for (const log of receipt.logs) {
                        try {
                            const decoded = decodeEventLog({
                                abi: contract.abi,
                                data: log.data,
                                topics: log.topics
                            });

                            if (decoded.eventName === 'JobCreated') {
                                console.log('decoded', decoded)
                                jobId = decoded.args.jobId;
                                //return decoded.args.jobId.toString();
                            }
                        } catch {
                            // Not this event, skip
                        }
                    }

                }
            }

            if (jobId) {
                let job = await getJobDetail(jobId);
                stats.job = job;

                await displayStats();

                YeomenAI.statusMessage(`Waiting for job events...`, YeomenAI.MESSAGE_TYPES.INFO);
                eventEmitter.on('BidPlaced', async (args) => {
                    if (args.jobId != jobId) return;
                    YeomenAI.statusMessage(
                        `Job #${args.jobId} - New bid placed by ${args.bidder} for ${args.amount}`
                    );

                    job = await getJobDetail(jobId);
                    stats.job = job;

                    await displayStats();
                });

                eventEmitter.on('BidAccepted', async (args) => {
                    if (args.jobId != jobId) return;
                    YeomenAI.statusMessage(
                        `Job #${args.jobId} - Bid accepted`
                    );

                    job = await getJobDetail(jobId);
                    stats.job = job;

                    await displayStats();

                });

                eventEmitter.on('JobCompleted', async (args) => {
                    if (args.jobId != jobId) return;
                    YeomenAI.statusMessage(
                        `Job #${args.jobId} - Job completed successfully`
                    );

                    job = await getJobDetail(jobId);
                    stats.job = job;

                    await displayStats();


                    YeomenAI.exit(0, `Job #${args.jobId} - Job completed successfully`);
                });
            }

        }

        if (role == 'worker') {
            YeomenAI.statusMessage(`Waiting for job events...`, YeomenAI.MESSAGE_TYPES.INFO);
            eventEmitter.on('JobCreated', async (args) => {
                if (jobId) return;
                YeomenAI.statusMessage(
                    `Job #${args.jobId} - New job`
                );

                let [bidPlaced, bidPlacedResponse] = await executeContractFunction(
                    'placeBid',
                    [args.jobId, 1, '0x0000000000000000000000000000000000000000', 'Auto accepting job request'],
                    `Successfully placed bid`,
                    `Failed to place bid`
                );

                if (bidPlaced) {
                    jobId = args.jobId;
                }


                job = await getJobDetail(jobId);
                stats.job = job;

                await displayStats();
            });

            eventEmitter.on('BidAccepted', async (args) => {
                if (args.jobId != jobId) return;
                YeomenAI.statusMessage(
                    `Job #${args.jobId} - Bid accepted`
                );

                job = await getJobDetail(jobId);
                stats.job = job;

                await displayStats();

                startProcessingJob(jobId);
            });

            eventEmitter.on('JobCompleted', async (args) => {
                if (args.jobId != jobId) return;
                YeomenAI.statusMessage(
                    `Job #${args.jobId} - Job completed successfully`
                );

                job = await getJobDetail(jobId);
                stats.job = job;

                await displayStats();
            });

            async function startProcessingJob(jobId) {
                YeomenAI.statusMessage(`Job #${jobId} - Start processing`, YeomenAI.MESSAGE_TYPES.INFO);
                try {

                    job = await getJobDetail(jobId);

                    //let coord = { x: -1304, y: 63, z: 601 };
                    let steps = JSON.parse(job.description);

                    for (let step of steps) {
                        let { action, args } = step;

                        if (action == 'move') {
                            //Move player
                            YeomenAI.statusMessage(`Moving player to position ${JSON.stringify(args.endCoord)}`, YeomenAI.MESSAGE_TYPES.INFO);
                            try {

                                const { invokedId } = await YeomenAI.invokeApp2(108, { formFields: { endCoord: args.endCoord } });
                                const invokedAppData = await new Promise(resolve => {
                                    const handler = data => {
                                        if (data?.id === invokedId) {
                                            YeomenAI.emitter.off('invokedApp:exit', handler);
                                            resolve(data);
                                        }
                                    };
                                    YeomenAI.emitter.on('invokedApp:exit', handler);
                                });

                                if (invokedAppData.state !== 0) {
                                    YeomenAI.statusMessage(`Failed to move to position: ${invokedAppData.message}.`, YeomenAI.MESSAGE_TYPES.ERROR);
                                    break;
                                }

                            } catch (err) {
                                YeomenAI.statusMessage(`Failed to invokeApp: ${err.message}.`, YeomenAI.MESSAGE_TYPES.ERROR);
                                break;
                            }

                        }

                        if (action == 'drop') {
                            //Can drop any item here
                            let currentPositionCoord = await getPlayerCurrentPosition();
                            let playerInventories = await DustprojectYeomen.getPlayerInventories(playerEntityId);

                            let dropInventorySlots = playerInventories.filter(
                                (playerInventory) =>
                                    [args.objectType].includes(playerInventory.objectType) && playerInventory.amount > 0
                            );

                            let remaining = args.amount; // total we still need to drop

                            let dropSlots = dropInventorySlots.map((item) => {
                                if (remaining <= 0) return null; // skip if we've already met the amount

                                let dropAmount = Math.min(item.amount, remaining);
                                remaining -= dropAmount;

                                return {
                                    slot: item.slot,    // uint16
                                    amount: dropAmount  // uint16
                                };
                            }).filter(Boolean); // remove null entries

                            let dropCoord = { ...currentPositionCoord, y: currentPositionCoord.y + 2 }

                            if (dropSlots.length > 0) {
                                YeomenAI.statusMessage(`Dropping items above position`, YeomenAI.MESSAGE_TYPES.INFO);

                                try {
                                    // Prepare arguments as per ABI
                                    let packedCoord = DustprojectYeomen.gameHelper.packCoord96(dropCoord.x, dropCoord.y, dropCoord.z);
                                    const args = [playerEntityId, dropSlots, packedCoord];

                                    try {
                                        await YeomenAI.estimateContractGas('drop', args, DustprojectYeomen.SYSTEMS.InventorySystemId);
                                    } catch (err) {
                                        console.error('dropItem gas estimation failed', err);
                                        YeomenAI.statusMessage(`Failed to estimate gas: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                                        break;
                                    }

                                    await YeomenAI.sendTransaction('drop', args, DustprojectYeomen.SYSTEMS.InventorySystemId);
                                    await YeomenAI.delay(2);

                                    YeomenAI.statusMessage(`Item(s) dropped successfully`, YeomenAI.MESSAGE_TYPES.SUCCESS);
                                } catch (err) {
                                    YeomenAI.statusMessage(`Failed to drop items: ${err.message}`, YeomenAI.MESSAGE_TYPES.ERROR);
                                    break;
                                }
                            }

                        }
                    }

                    let [jobCompleted, jobCompletedResponse] = await executeContractFunction(
                        'completeJob',
                        [jobId],
                        `Successfully completed job`,
                        `Failed to complete job`
                    );

                    if (jobCompleted) {
                        YeomenAI.statusMessage(`Job #${jobId} - Completed processing`, YeomenAI.MESSAGE_TYPES.INFO);
                        jobId = null;
                    }

                } catch (err) {
                    console.log('error processing', err)
                    YeomenAI.statusMessage(`Job #${jobId} - Failed processing`, YeomenAI.MESSAGE_TYPES.INFO);
                    jobId = null;
                }

            }

        }


    } catch (err) {
        console.log(err)
    }
})()