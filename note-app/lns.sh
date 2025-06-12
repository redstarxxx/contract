#!/bin/bash

echo "开始创建软链接..."

# 检查是否存在 contracts 文件或文件夹
if [ -e "contracts" ]; then
    echo "发现已存在的 contracts，将其重命名为 contracts_old"
    # 如果 contracts_old 已存在，先删除它
    if [ -e "contracts_old" ]; then
        echo "删除已存在的 contracts_old"
        rm -rf "contracts_old"
    fi
    mv "contracts" "contracts_old"
fi

# 创建软链接
echo "创建 contracts 软链接..."
ln -s "../hardhat/artifacts/contracts" "contracts"

echo "软链接创建完成!"
