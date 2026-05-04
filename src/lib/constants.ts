// EXAMPLE: Vulnerable contract for demo
export const EXAMPLE_VULNERABLE_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint256) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    // VULNERABILITY: Reentrancy attack
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // VULNERABILITY: Unsafe external call before state update
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        balances[msg.sender] -= amount; // state update after external call!
    }
    
    // VULNERABILITY: Integer overflow (in older versions)
    function unsafeAdd(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }
    
    // VULNERABILITY: Missing access control
    function emergencyWithdraw() public {
        payable(msg.sender).transfer(address(this).balance);
    }
}`

export const MAX_CONTRACT_LENGTH = 50000 // symbols
export const MIN_CONTRACT_LENGTH = 50

export const APP_NAME = 'AI Contract Auditor'
export const APP_DESCRIPTION =
	'AI-powered Solidity smart contract security auditor'
