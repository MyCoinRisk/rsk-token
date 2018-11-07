#### rsk-token

`仓库Smart Contract基于OpenZeppelin/openzeppelin-solidity框架编写，主要有3个合约组成RskToken、RskCrowdsale、RskCrowdsaleConfig组成。`

##### Issue Token流程

- 申请所需的wallet

  ```markdown
  # 申请owner账号(需要eth，用于部署smart contract)
  # 申请RskCrowdsaleConfig所需的Wallet Address：
  - Employees Wallet
  - Advisors Wallet
  - Patterns Wallet
  - Ailares/Company Wallet
  - Fundation Wallet
  ```

- 配置eth mainne和deploy

  ```markdown
  # 修改RskCrowdsaleConfig对应的address
  # 配置truffle.js为eth mainet环境，使用truffle deploy到eth mainet
  ```

##### RSK Token的分配表格

|     Wallet      | Number of Tokens | Percent |  Lockup   |                    Vesting                    |
| :-------------: | :--------------: | :-----: | :-------: | :-------------------------------------------: |
|    Employees    |   300,000,000    |  15.0%  |     -     | lock up for 12 months, quaterly for 48 months |
|    Advisors     |   110,000,000    |  5.5%   |     -     |  lockup for 3 months, quaterly for 24 months  |
|    Patterns     |   150,000,000    |  7.5%   | 3 months  |                       -                       |
| Ailares/Company |   240,000,000    |  12.0%  | 12 months |                       -                       |
|    Fundation    |  1,200,000,000   |  60.0%  |     -     |                       -                       |

##### 各合约功能

```markdown
- RskToken:实现ERC20标准的token
- RskCrowdsaleConfig:配置RSK Token的分配和一些基本的constant变量
- RskCrowdsale:实现上述RSK Token的分配表格的规则
```

##### 参考链接

- [OpenZeppelin/openzepelin-solidity](https://github.com/OpenZeppelin/openzeppelin-solidity)
