#!/bin/bash

# 设置颜色代码
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
GRAY='\033[0;90m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 从.env文件获取部署账户地址
DEPLOYER_ADDRESS=""
if [ -f ".env" ]; then
    PRIVATE_KEY=$(grep PRIVATE_KEY .env | cut -d '=' -f2 | tr -d '"' | tr -d ' ')
    if [ ! -z "$PRIVATE_KEY" ]; then
        # 使用node来获取地址
        DEPLOYER_ADDRESS=$(node -e "
            const ethers = require('ethers');
            const wallet = new ethers.Wallet('$PRIVATE_KEY');
            console.log(wallet.address);
        " 2>/dev/null)
    fi
fi

# 获取脚本文件路径的函数
get_script_path() {
    local script_name="$1"
    # 首先检查当前目录下的 scripts 文件夹
    if [ -f "scripts/$script_name" ]; then
        echo -e "${GREEN}找到脚本: scripts/$script_name${NC}" >&2
        echo "scripts/$script_name"
        return 0
    # 然后检查上层目录的 scripts 文件夹
    elif [ -f "../scripts/$script_name" ]; then
        echo -e "${YELLOW}在上层目录找到脚本: ../scripts/$script_name${NC}" >&2
        echo "../scripts/$script_name"
        return 0
    else
        echo -e "${RED}警告: 未找到脚本 $script_name${NC}" >&2
        echo "scripts/$script_name"  # 如果都找不到，返回默认路径
        return 1
    fi
}

# 定义脚本文件路径
SCRIPT_CHECK=$(get_script_path "check.js")
SCRIPT_DEPLOY=$(get_script_path "deploy.js")
SCRIPT_INTERACT=$(get_script_path "interact.js")

# 存储文件状态（0表示缺失，1表示存在）
CHECK_STATUS=0
DEPLOY_STATUS=0
INTERACT_STATUS=0

# 检查文件是否存在的函数
check_file() {
    if [ ! -f "$1" ]; then
        echo -e "${RED}错误: 找不到文件 $1${NC}"
        return 1
    fi
    return 0
}

# 检查所有必需文件
check_all_files() {
    if [ -f "$SCRIPT_CHECK" ]; then
        CHECK_STATUS=1
    else
        CHECK_STATUS=0
    fi

    if [ -f "$SCRIPT_DEPLOY" ]; then
        DEPLOY_STATUS=1
    else
        DEPLOY_STATUS=0
    fi

    if [ -f "$SCRIPT_INTERACT" ]; then
        INTERACT_STATUS=1
    else
        INTERACT_STATUS=0
    fi
}

# 格式化菜单项，如果需要文件但找不到则添加标记
format_menu_item() {
    local text="$1"
    local status="$2"

    if [ "$status" -eq 0 ]; then
        echo "$text ${GRAY}[文件未找到]${NC}"
    else
        echo "$text"
    fi
}

# 验证合约的函数
verify_contract() {
    echo -e "${CYAN}===== 合约验证 =====${NC}"
    echo -e "${YELLOW}请输入合约地址:${NC}"
    read -p "" contract_address

    if [ -z "$contract_address" ]; then
        echo -e "${RED}错误: 合约地址不能为空${NC}"
        return 1
    fi

    # 列出已编译的合约
    echo -e "\n${YELLOW}选择要验证的合约:${NC}"
    local contracts=()
    local i=1

    if [ -d "artifacts/contracts" ]; then
        for dir in artifacts/contracts/*/; do
            name=$(basename "$dir")
            name=${name%.sol}
            echo "$i) $name"
            contracts+=("$name")
            ((i++))
        done

        read -p "请选择合约编号: " contract_choice

        if ! [[ "$contract_choice" =~ ^[0-9]+$ ]] || [ "$contract_choice" -lt 1 ] || [ "$contract_choice" -gt ${#contracts[@]} ]; then
            echo -e "${RED}错误: 无效的选择${NC}"
            return 1
        fi

        local contract_name=${contracts[$((contract_choice-1))]}

        echo -e "\n${YELLOW}请输入构造函数参数 (如有多个参数请用空格分隔):${NC}"
        read -p "" constructor_args

        # 获取部署者地址
        if [ ! -z "$DEPLOYER_ADDRESS" ]; then
            echo -e "\n${CYAN}检测到部署者地址: $DEPLOYER_ADDRESS${NC}"
            echo -e "${YELLOW}是否使用此地址? [Y/n]:${NC}"
            read -p "" use_detected_address
            if [[ $use_detected_address =~ ^[Nn]$ ]]; then
                echo -e "${YELLOW}请输入部署者地址 (直接回车则忽略):${NC}"
                read -p "" deployer_address
            else
                deployer_address=$DEPLOYER_ADDRESS
            fi
        else
            echo -e "\n${YELLOW}请输入部署者地址 (直接回车则忽略):${NC}"
            read -p "" deployer_address
        fi

        if [ -z "$constructor_args" ]; then
            if [ ! -z "$deployer_address" ]; then
                echo -e "${BLUE}正在验证合约 (仅部署者地址)...${NC}"
                execute_command "npx hardhat verify --network moonbase $contract_address \"$deployer_address\""
            else
                echo -e "${BLUE}正在验证合约 (无参数)...${NC}"
                execute_command "npx hardhat verify --network moonbase $contract_address"
            fi
        else
            # 构造函数参数数组
            local params=()
            for arg in $constructor_args; do
                params+=("\"$arg\"")
            done

            # 如果有部署者地址，添加到参数末尾
            if [ ! -z "$deployer_address" ]; then
                params+=("\"$deployer_address\"")
            fi

            # 构建并执行验证命令
            echo -e "${BLUE}正在验证合约...${NC}"
            local verify_cmd="npx hardhat verify --network moonbase $contract_address ${params[*]}"
            execute_command "$verify_cmd"
        fi
    else
        echo -e "${RED}错误: 未找到已编译的合约${NC}"
        return 1
    fi
}

# 执行命令前检查文件
can_execute() {
    local file="$1"
    if [ ! -f "$file" ]; then
        echo -e "${RED}错误: 找不到必需的文件 $file${NC}"
        return 1
    fi
    return 0
}

# 列出可用合约的函数
list_contracts() {
    echo -e "${BLUE}可用的合约:${NC}"
    if [ -d "artifacts/contracts" ]; then
        for dir in artifacts/contracts/*/; do
            name=$(basename "$dir")
            name=${name%.sol}
            echo -e "${YELLOW}- $name${NC}"
        done
    elif [ -d "../artifacts/contracts" ]; then
        for dir in ../artifacts/contracts/*/; do
            name=$(basename "$dir")
            name=${name%.sol}
            echo -e "${YELLOW}- $name${NC}"
        done
    else
        echo -e "${RED}未找到合约文件${NC}"
        return 1
    fi
}

# 执行命令的函数
execute_command() {
    echo -e "${BLUE}执行命令: $1${NC}"
    eval "$1"
    local status=$?
    if [ $status -eq 0 ]; then
        echo -e "${GREEN}命令执行成功${NC}"
    else
        echo -e "${RED}命令执行失败${NC}"
    fi
    echo
    return $status
}

# 清屏
clear

# 初始检查所有文件
check_all_files

# 部署合约的函数
deploy_contract() {
    local network=$1
    if [ "$network" = "local" ]; then
        network_name="localhost"
        echo -e "${YELLOW}准备部署到本地网络...${NC}"
    else
        network_name="moonbase"
        echo -e "${YELLOW}准备部署到 Moonbase 测试网...${NC}"
    fi

    if can_execute "$SCRIPT_DEPLOY"; then
        list_contracts
        execute_command "npx hardhat run $SCRIPT_DEPLOY --network $network_name"

        if [ "$network" = "moonbase" ]; then
            echo -e "${CYAN}是否要验证合约? [y/N]${NC}"
            read -p "" verify_choice
            if [[ $verify_choice =~ ^[Yy]$ ]]; then
                echo -e "${YELLOW}请输入合约地址:${NC}"
                read -p "" contract_address
                echo -e "${YELLOW}请输入合约名称(e.g., MyNFT):${NC}"
                read -p "" contract_name
                echo -e "${YELLOW}请输入代币符号(e.g., MNFT):${NC}"
                read -p "" token_symbol

                if [ -z "$DEPLOYER_ADDRESS" ]; then
                    echo -e "${YELLOW}请输入部署账户地址:${NC}"
                    read -p "" DEPLOYER_ADDRESS
                fi

                if [ ! -z "$contract_address" ] && [ ! -z "$contract_name" ] && [ ! -z "$token_symbol" ] && [ ! -z "$DEPLOYER_ADDRESS" ]; then
                    echo -e "${BLUE}正在验证合约...${NC}"
                    execute_command "npx hardhat verify --network moonbase $contract_address \"$contract_name\" \"$token_symbol\" \"$DEPLOYER_ADDRESS\""
                else
                    echo -e "${RED}错误: 请提供所有必需的参数${NC}"
                fi
            fi
        fi
    fi
}

# 主菜单循环
while true; do
    echo -e "${YELLOW}=== Hardhat DApp 开发助手 ===${NC}"
    echo "1. 初始化项目"
    echo -e "$(format_menu_item "2. 检查源码路径" "$CHECK_STATUS")"
    echo "3. 编译合约"
    echo "4. 运行测试"
    echo -e "$(format_menu_item "5. 部署合约" "$DEPLOY_STATUS")"
    echo "6. 验证合约"
    echo -e "$(format_menu_item "7. 交互式调用(脚本)" "$INTERACT_STATUS")"
    echo "8. 交互式控制台"
    echo "9. 控制台常用命令参考"
    echo "0. 退出"
    echo -e "${YELLOW}===========================${NC}"

    read -p "请选择操作 [0-9]: " choice
    echo

    case $choice in
        1)
            # execute_command "npx hardhat"
            echo -e "${GREEN}手动执行 (如果已经执行过可以忽略):${NC}"
            echo -e "${RED}npx hardhat${NC}"
            echo -e "${RED}npm install @openzeppelin/contracts${NC}"
            check_all_files  # 重新检查文件状态
            ;;
        2)
            if can_execute "$SCRIPT_CHECK"; then
                execute_command "npx hardhat run $SCRIPT_CHECK"
            fi
            ;;
        3)
            execute_command "npx hardhat compile"
            ;;
        4)
            execute_command "npx hardhat test"
            ;;
        5)
            echo -e "${YELLOW}选择部署网络:${NC}"
            echo "1. 本地网络"
            echo "2. Moonbase 测试网"
            read -p "请选择 [1-2]: " deploy_choice
            case $deploy_choice in
                1)
                    deploy_contract "local"
                    ;;
                2)
                    deploy_contract "moonbase"
                    ;;
                *)
                    echo -e "${RED}无效的选择${NC}"
                    ;;
            esac
            ;;
        6)
            verify_contract
            ;;
        7)
            ;;
        6)
            if can_execute "$SCRIPT_INTERACT"; then
                list_contracts
                execute_command "npx hardhat run $SCRIPT_INTERACT --network moonbase"
            fi
            ;;
        8)
            echo -e "${BLUE}启动交互式控制台...${NC}"
            echo -e "${GREEN}提示: 使用以下命令获取合约实例：${NC}"
            echo -e "${YELLOW}const address = \"你的合约地址\";${NC}"
            echo -e "${YELLOW}const contract = await ethers.getContractAt(\"合约名\", address);${NC}"
            echo -e "${YELLOW}await contract.name();${NC}"
            echo -e "${YELLOW}使用 .exit 退出控制台${NC}"
            echo
            execute_command "npx hardhat console --network moonbase"
            ;;
        9)
            echo -e "${BLUE}=== 常用控制台命令参考 ===${NC}"
            echo -e "${YELLOW}1. 通过私钥获取钱包：${NC}"
            echo -e "const privateKey = \"你的私钥\";"
            echo -e "const wallet = new ethers.Wallet(privateKey, ethers.provider);"
            echo -e "console.log(\"钱包地址:\", wallet.address);"
            echo
            echo -e "${YELLOW}2. 获取账户余额：${NC}"
            echo -e "const balance = await ethers.provider.getBalance(\"账户地址\");"
            echo -e "console.log(\"余额:\", ethers.utils.formatEther(balance));"
            echo
            echo -e "${YELLOW}3. 发送ETH交易：${NC}"
            echo -e "const tx = await wallet.sendTransaction({"
            echo -e "  to: \"接收地址\","
            echo -e "  value: ethers.utils.parseEther(\"0.1\")"
            echo -e "});"
            echo
            echo -e "${YELLOW}4. 获取合约实例：${NC}"
            echo -e "const contract = await ethers.getContractAt(\"合约名\", \"合约地址\");"
            echo
            echo -e "${YELLOW}5. 链接钱包到合约：${NC}"
            echo -e "const contractWithSigner = contract.connect(wallet);"
            echo
            echo -e "${YELLOW}6. 查询网络信息：${NC}"
            echo -e "const network = await ethers.provider.getNetwork();"
            echo -e "console.log(\"Chain ID:\", network.chainId);"
            echo
            echo -e "${YELLOW}7. 获取Gas价格：${NC}"
            echo -e "const gasPrice = await ethers.provider.getGasPrice();"
            echo -e "console.log(\"Gas价格:\", ethers.utils.formatUnits(gasPrice, \"gwei\"), \"gwei\");"
            ;;
        0)
            echo -e "${GREEN}感谢使用，再见！${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}无效的选择，请重试${NC}"
            ;;
    esac

    echo -e "${YELLOW}按回车键继续...${NC}"
    read -r
    clear
done
