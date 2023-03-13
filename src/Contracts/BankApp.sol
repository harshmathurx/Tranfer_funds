//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Doofens{
    mapping (address => uint) UserAccountBalances;
    mapping (address => bool) UserExists;

    function createDoof() public returns(bool){
        require(UserExists[msg.sender] == false,"Doof already exists");
        UserExists[msg.sender] = true;
        return true;
    }

    function doofExists() public view returns(bool){
        return UserExists[msg.sender];
    }

    function withdraw(uint withdrawAmount) public payable {
        require( (UserExists[msg.sender]==true) && (withdrawAmount < UserAccountBalances[msg.sender]) );
        UserAccountBalances[msg.sender] = UserAccountBalances[msg.sender] - withdrawAmount;
    }

    function accountBalance() public view returns(uint){
        return UserAccountBalances[msg.sender];
    }
    
    function earn() public payable{
        UserAccountBalances[msg.sender] = UserAccountBalances[msg.sender] + 2;
    }

    function transferDoofs(address payable reciever, uint256 transferAmount) public payable{    
        require(UserExists[reciever]== true,"The reciever isn't a Doof");
        require(UserExists[msg.sender]== true,"Create an account to proceed");
        require(transferAmount>0,"You need to earn Doof coins to tranfer them");
        require(transferAmount < UserAccountBalances[msg.sender],"Insufficient DoofCoins");
        UserAccountBalances[msg.sender] = UserAccountBalances[msg.sender] - transferAmount;
        UserAccountBalances[reciever]+= transferAmount;
        //Amount withdrawed must be transfered reciever.transfer(transferAmount);
    }

}