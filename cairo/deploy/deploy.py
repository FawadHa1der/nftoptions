import os
from dotenv import load_dotenv
from nile.nre import NileRuntimeEnvironment

# Dummy values, should be replaced by env variables
os.environ["SIGNER"] = "123456"
os.environ["USER_1"] = "12345654321"
from nile.signer import Signer


from nile.nre import NileRuntimeEnvironment

# Dummy values, should be replaced by env variables
os.environ["SIGNER"] = "123456"
os.environ["USER_1"] = "12345654321"

CLASS_HASH_ERC721_OPTION = 0x65cb389d07985f12ca9bb2210204f4a15825270e5ffaf9f3923d133225c7535
ERC20PAYMENT_TEST_TOKEN = 0x07394cbe418daa16e42b87ba67372d4ab4a5df0b05c6e554d158458ce245bc10

def to_uint(a):
    """Takes in value, returns uint256-ish tuple."""
    return (a & ((1 << 128) - 1), a >> 128)


def str_to_felt(text):
    b_text = bytes(text, "ascii")
    return int.from_bytes(b_text, "big")


def run(nre: NileRuntimeEnvironment):
    load_dotenv()
    # predeclared_class = nre.get_declaration("erc721_option")
    
    # signer,_ = nre.get_deployment("account-0")
    user_1 = nre.get_or_deploy_account("PRIVATE_KEY1")
    print(f"Signer account: {user_1.address}")
    # print(f"User1 account: {user_1.address}")

    # proxy_impl, proxy_abi = nre.deploy("Proxy", arguments=[f'{CLASS_HASH_ERC721_OPTION}'])
    # print(f"Deployed proxy_impl to {proxy_impl}")

    # xzkp_token_implementation = None
    # try:
    #     xzkp_token_implementation, abi = nre.deploy(
    #         "ZkPadStaking", alias="xzkp_token_implementation")
    # except Exception as error:
    #     if "already exists" in str(error):
    #         xzkp_token_implementation, _ = nre.get_deployment(
    #             "xzkp_token_implementation")
    #     else:
    #         print(f"DEPLOYMENT ERROR: {error}")
    # finally:
    #     print(
    #         f"xZKP token implementation deployed to {xzkp_token_implementation}")

    user_1.send(0x048a64f708011fb5089778204f37d6111bd9bbac0fe4b6e7851292b8cbeeb6ef, 'initializer', [int(user_1.address, 16), ERC20PAYMENT_TEST_TOKEN])