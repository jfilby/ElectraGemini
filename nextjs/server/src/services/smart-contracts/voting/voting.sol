// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Proposal {
        string id;
        string instanceId;
        string name;
        uint voteCount;
        mapping(string => bool) votes;
    }

    mapping(string => Proposal) public proposals;
    uint public proposalCount;
    address public owner;

    event Voted(string indexed voter,
                string proposalId,
                bool voteOption);

    event ProposalAdded(
            string id,
            string instanceId,
            string name);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function addProposal(
               string memory id,
               string memory instanceId,
               string memory name) public onlyOwner {

        require(bytes(proposals[id].id).length == 0, "Proposal with this ID already exists");

        proposalCount++;

        Proposal storage newProposal = proposals[id];
        newProposal.id = id;
        newProposal.instanceId = instanceId;
        newProposal.name = name;
        newProposal.voteCount = 0;

        emit ProposalAdded(id, instanceId, name);
    }

    function vote(string memory userProfileId,
                  string memory proposalId,
                  bool voteOption) public onlyOwner {

        require(bytes(proposals[proposalId].id).length > 0, "Invalid proposal");

        bool existingVote = false;

        if (proposals[proposalId].votes[userProfileId] == true) {
          existingVote = true;
        }

        if (existingVote != voteOption) {

          proposals[proposalId].votes[userProfileId] = voteOption;

          if (existingVote == false &&
              voteOption == true) {

            proposals[proposalId].voteCount++;

          } else if (existingVote == true &&
                     voteOption == false) {

            proposals[proposalId].voteCount--;
          }
        }

        emit Voted(userProfileId,
                   proposalId,
                   voteOption);
    }

    function getProposal(
               string memory proposalId) public view
               returns (string memory id,
                        string memory instanceId,
                        string memory name,
                        uint voteCount) {

        require(bytes(proposals[proposalId].id).length > 0, "Proposal does not exist");

        Proposal storage proposal = proposals[proposalId];

        return (proposal.id,
                proposal.instanceId,
                proposal.name,
                proposal.voteCount);
    }

    function hasVoted(
               string memory userProfileId,
               string memory proposalId) public view returns (bool) {

        require(bytes(proposals[proposalId].id).length > 0, "Proposal does not exist");

        return proposals[proposalId].votes[userProfileId];
    }
}
