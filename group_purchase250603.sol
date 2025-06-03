// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Participationtest {
    struct Purchase {
        uint256 unitPrice; // 참여 금액
        uint256 targetParticipants; // 목표 참여자 수
        uint256 currentParticipants; // 현재 참여자 수
        uint256 deadline; // 마감 시간
        bool isCompleted; // 완료 여부
        bool isWithdrawn; // 인출 여부
        address creator; // 개설자
        string itemName; // ✅ 물품 이름
        mapping(address => uint256) participationCount;
        address[] participants;
    }

    uint256[] public purchaseList;
    mapping(uint256 => Purchase) public purchases;
    mapping(address => uint256) public balances;
    mapping(uint256 => uint256) public purchaseFunds;
    mapping(uint256 => mapping(address => bool)) public isParticipantAdded;

    event Deposited(address indexed user, uint256 amount);
    event Participated(
        uint256 indexed purchaseId,
        address indexed participant,
        uint256 count
    );
    event ParticipationCancelled(
        uint256 indexed purchaseId,
        address indexed participant,
        uint256 count
    );
    event Refunded(
        uint256 indexed purchaseId,
        address indexed participant,
        uint256 amount
    );
    event RefundedAll(uint256 indexed purchaseId);
    event Withdrawn(
        uint256 indexed purchaseId,
        address indexed creator,
        uint256 amount
    );

    function deposit() external payable {
        require(msg.value > 0, "No ETH sent");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function setupPurchase(
        uint256 purchaseId,
        uint256 _unitPrice,
        uint256 _targetParticipants,
        uint256 durationSeconds,
        string memory _itemName
    ) external {
        Purchase storage p = purchases[purchaseId];
        p.unitPrice = _unitPrice;
        p.targetParticipants = _targetParticipants;
        p.deadline = block.timestamp + durationSeconds;
        p.isCompleted = false;
        p.isWithdrawn = false;
        p.creator = msg.sender;
        p.itemName = _itemName;
        purchaseList.push(purchaseId);
    }

    function participate(uint256 purchaseId) external {
        Purchase storage p = purchases[purchaseId];
        require(p.deadline != 0, "Purchase does not exist");
        require(block.timestamp <= p.deadline, "Deadline passed");
        require(!p.isCompleted, "Purchase completed");
        require(balances[msg.sender] >= p.unitPrice, "Insufficient balance");

        balances[msg.sender] -= p.unitPrice;
        purchaseFunds[purchaseId] += p.unitPrice;
        p.participationCount[msg.sender] += 1;

        if (!isParticipantAdded[purchaseId][msg.sender]) {
            p.participants.push(msg.sender);
            isParticipantAdded[purchaseId][msg.sender] = true;
        }

        p.currentParticipants += 1;

        emit Participated(
            purchaseId,
            msg.sender,
            p.participationCount[msg.sender]
        );

        if (p.currentParticipants >= p.targetParticipants) {
            p.isCompleted = true;
        }
    }

    function cancelParticipation(uint256 purchaseId) external {
        Purchase storage p = purchases[purchaseId];
        require(p.deadline != 0, "Purchase does not exist");
        require(block.timestamp < p.deadline, "Deadline passed");
        require(!p.isCompleted, "Purchase completed");
        uint256 count = p.participationCount[msg.sender];
        require(count > 0, "No participation to cancel");

        p.participationCount[msg.sender] -= 1;
        p.currentParticipants -= 1;
        balances[msg.sender] += p.unitPrice;
        purchaseFunds[purchaseId] -= p.unitPrice;

        emit ParticipationCancelled(
            purchaseId,
            msg.sender,
            p.participationCount[msg.sender]
        );
    }

    function refundAll(uint256 purchaseId) external {
        Purchase storage p = purchases[purchaseId];
        require(p.deadline != 0, "Purchase does not exist");
        require(!p.isCompleted, "Purchase completed, cannot refund");
        require(
            msg.sender == p.creator || block.timestamp > p.deadline,
            "Only creator before deadline, anyone after deadline"
        );

        for (uint256 i = 0; i < p.participants.length; i++) {
            address user = p.participants[i];
            uint256 refundAmount = p.participationCount[user] * p.unitPrice;

            if (refundAmount > 0) {
                balances[user] += refundAmount;
                emit Refunded(purchaseId, user, refundAmount);
                p.participationCount[user] = 0;
                isParticipantAdded[purchaseId][user] = false;
            }
        }

        delete p.participants;
        p.currentParticipants = 0;
        purchaseFunds[purchaseId] = 0;

        emit RefundedAll(purchaseId);
    }

    function withdraw(uint256 purchaseId) external {
        Purchase storage p = purchases[purchaseId];
        require(msg.sender == p.creator, "Only creator can withdraw");
        require(p.isCompleted, "Purchase not completed yet");
        require(!p.isWithdrawn, "Already withdrawn");

        uint256 totalAmount = purchaseFunds[purchaseId];
        require(totalAmount > 0, "No funds to withdraw");

        p.isWithdrawn = true;
        purchaseFunds[purchaseId] = 0;
        balances[p.creator] += totalAmount;

        emit Withdrawn(purchaseId, msg.sender, totalAmount);
    }

    function getPurchaseInfo()
        public
        view
        returns (
            uint256[] memory ids,
            uint256[] memory unitPrices,
            uint256[] memory targetCounts,
            uint256[] memory currentCounts,
            uint256[] memory deadlines,
            bool[] memory completeds,
            string[] memory itemNames
        )
    {
        uint256 len = purchaseList.length;
        ids = new uint256[](len);
        unitPrices = new uint256[](len);
        targetCounts = new uint256[](len);
        currentCounts = new uint256[](len);
        deadlines = new uint256[](len);
        completeds = new bool[](len);
        itemNames = new string[](len);

        for (uint256 i = 0; i < len; i++) {
            uint256 pid = purchaseList[i];
            Purchase storage p = purchases[pid];
            ids[i] = pid;
            unitPrices[i] = p.unitPrice;
            targetCounts[i] = p.targetParticipants;
            currentCounts[i] = p.currentParticipants;
            deadlines[i] = p.deadline;
            completeds[i] = p.isCompleted;
            itemNames[i] = p.itemName;
        }
    }

    function getPurchase(
        uint256 purchaseId
    )
        public
        view
        returns (
            uint256 unitPrice,
            uint256 targetParticipants,
            uint256 currentParticipants,
            uint256 deadline,
            bool isCompleted,
            address creator,
            string memory itemName
        )
    {
        Purchase storage p = purchases[purchaseId];
        return (
            p.unitPrice,
            p.targetParticipants,
            p.currentParticipants,
            p.deadline,
            p.isCompleted,
            p.creator,
            p.itemName
        );
    }

    function getParticipationCount(
        uint256 purchaseId,
        address user
    ) external view returns (uint256) {
        return purchases[purchaseId].participationCount[user];
    }

    function getPurchaseFunds(
        uint256 purchaseId
    ) external view returns (uint256) {
        return purchaseFunds[purchaseId];
    }

    function withdrawMyBalance() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
