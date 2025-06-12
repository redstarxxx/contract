// const { ethers } = require("hardhat");
const { expect } = require("chai"); //调用chai的expect函数,它返回一个链式可调用的对象,该对象具有各种断言方法
const { ethers } = require("hardhat");//ethers变量在全局作用域下都可用。 如果你希望代码更明确


const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");


describe("Token contract", function () {
  async function deployTokenFixture() {
    const Token = await ethers.getContractFactory("Token");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const hardhatToken = await Token.deploy();

    await hardhatToken.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { Token, hardhatToken, owner, addr1, addr2 };
  }

  it("Should assign the total supply of tokens to the owner", async function () {
    const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function () {
    const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );

    // Transfer 50 tokens from owner to addr1
    await expect(
      hardhatToken.transfer(addr1.address, 50)
    ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);

    // Transfer 50 tokens from addr1 to addr2
    // We use .connect(signer) to send a transaction from another account
    await expect(
      hardhatToken.connect(addr1).transfer(addr2.address, 50)
    ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
  });
});


describe("Transactions", function () {

  it("Should transfer tokens between accounts", async function() {
    //获取以太坊帐户的Signer对象,它们是通过调用getSigners()方法返回的Promise解析的
    const [owner, addr1, addr2] = await ethers.getSigners();
›
    //ContractFactory是用于部署新智能合约的抽象,因此此处的Token是用来实例代币合约的工厂
    const Token = await ethers.getContractFactory("Token");

    //在ContractFactory上调用deploy()将启动部署,并返回解析为Contract的Promise.该对象包含了智能合约所有函数的方法
    const hardhatToken = await Token.deploy();

    // Transfer 50 tokens from owner to addr1
    await hardhatToken.transfer(addr1.address, 50);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);
    
    // Transfer 50 tokens from addr1 to addr2
    await hardhatToken.connect(addr1).transfer(addr2.address, 50);
    expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
  });
});


/*

describe("Token contract", function() {
  it("Deployment should assign the total supply of tokens to the owner", async function() {
    //节点为Hardhat Network,并且仅保留第一个帐户.Signer 代表以太坊账户对象.它用于将交易发送到合约和其他帐户
    const [owner] = await ethers.getSigners();
    //ContractFactory是用于部署新智能合约的抽象,因此此处的Token是用来实例代币合约的工厂
    const Token = await ethers.getContractFactory("Token");
    //在ContractFactory上调用deploy()将启动部署,并返回解析为Contract的Promise.该对象包含了智能合约所有函数的方法
    const hardhatToken = await Token.deploy();

    //在部署合约后,我们可以在hardhatToken 上调用合约方法,通过调用balanceOf()来获取所有者帐户的余额
    //expect()是chai的一个函数,它返回一个链式可调用的对象,该对象具有各种断言方法
    const ownerBalance = await hardhatToken.balanceOf(owner.address);

    //再次使用 Contract 实例调用Solidity代码中合约函数totalSupply() 返回代币的发行量,我们检查它是否等于ownerBalance
    //expect()函数的参数是一个Promise,它会在Promise解析后返回一个值
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});



describe("Transactions", function () {

  it("Should transfer tokens between accounts", async function() {
    //获取以太坊帐户的Signer对象,它们是通过调用getSigners()方法返回的Promise解析的
    const [owner, addr1, addr2] = await ethers.getSigners();

    //ContractFactory是用于部署新智能合约的抽象,因此此处的Token是用来实例代币合约的工厂
    const Token = await ethers.getContractFactory("Token");

    //在ContractFactory上调用deploy()将启动部署,并返回解析为Contract的Promise.该对象包含了智能合约所有函数的方法
    const hardhatToken = await Token.deploy();

    // Transfer 50 tokens from owner to addr1
    await hardhatToken.transfer(addr1.address, 50);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);
    
    // Transfer 50 tokens from addr1 to addr2
    await hardhatToken.connect(addr1).transfer(addr2.address, 50);
    expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
  });
});


*/









/*


describe("Token contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
    // Get the ContractFactory and Signers here.
    const Token = await ethers.getContractFactory("Token");
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // its deployed() method, which happens once its transaction has been
    // mined.
    const hardhatToken = await Token.deploy();

    await hardhatToken.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { Token, hardhatToken, owner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define each
    // of your tests. It receives the test name, and a callback function.
    //
    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

      // `expect` receives a value and wraps it in an assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be
      // equal to our Signer's owner.
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      // Transfer 50 tokens from owner to addr1
      await expect(
        hardhatToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(
        hardhatToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
    });

    it("Should emit Transfer events", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to addr1
      await expect(hardhatToken.transfer(addr1.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner.
      // `require` will evaluate false and revert the transaction.
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // Owner balance shouldn't have changed.
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});



*/










