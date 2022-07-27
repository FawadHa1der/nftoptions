from nile.core.account import Account
import os

os.environ["SIGNER"] = "123456"
#os.environ["SIGNER"] = "123456"
RECV_ACCOUNTS = []

TEST_721_TOKEN_ADDRESS = 0x03a0dbc41c598ca8a59e16c2c2aa3b6f4c82ab62331d91a5df4af3eb18156122

def str_to_felt(text):
    b_text = bytes(text, "ascii")
    return int.from_bytes(b_text, "big")


def felt_to_str(felt):
    b_felt = felt.to_bytes(31, "big")
    return b_felt.decode()


def run(nre):
    felt721 = str_to_felt("Test721")
    ricks = str_to_felt("ricks")
    signer = Account("SIGNER", nre.network)

    print(f"Signer account: {signer}")
    print(f"Network: {nre.network}")
    # print(f"OSEnviron: {os.environ}")
    # print(f" felt721 is  {felt721} and signer address is {signer.address}")

    test721Impl, test721abi = nre.deploy(
        "Test721", arguments=[f'{felt721}', f'{felt721}', f'{signer.address}'], alias="Test721")
    print(f"Deployed test 721 to {test721Impl}")

    stakingpool_impl, abi = nre.deploy(
        "stakingpool", arguments=[], alias="stakingpool")
    print(f"Deployed stakingpool_impl to {stakingpool_impl}")

    # ricks = await starknet.deploy(
    #     contract_def=ricks_def,
    #     constructor_calldata=[
    #         str_to_felt("RICKS"),      # name
    #         str_to_felt("RCK"),        # symbol
    #         18,                        # decimals
    #         INITIAL_RICKS_SUPPLY,               # initial_supply
    #         erc721.contract_address,
    #         TOKEN,
    #         DAILY_INFLATION_RATE,
    #         stakingPool.contract_address,
    #         erc20Weth.contract_address
    #     ]
    # )

    # ricks_impl, abi = nre.deploy(
    #     "ricks", arguments=[f'{ricks}', f'{ricks}', f'{18}', f'{INITIAL_RICKS_SUPPLY}', f'{DAILY_INFLATION_RATE}', f'{AUCTION_LENGTH}', f'{AUCTION_INTERVAL}', f'{MIN_BID_INCREASE}', f'{stakingpool_impl}', f'{TEST_REWARD_TOKEN_ADDRESS}'], alias="ricks")
    # print(f"Deployed ricks_impl to {ricks_impl}")

    # erc721_impl, abi = nre.deploy(
    #     "weth", arguments=[], alias="mytoken")
    # print(f"Deployed stakingpool_impl to {stakingpool_impl}")

    # stakingpool_impl, abi = nre.deploy(
    #     "stakingpool", arguments=[], alias="stakingpool")
    # print(f"Deployed stakingpool_impl to {stakingpool_impl}")

    # nre.invoke
