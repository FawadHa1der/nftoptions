import erc20compiledcontract from 'compiledcairo/erc20.json'
import optionscompiledcontract from 'compiledcairo/erc721_option.json'
import { Contract } from 'starknet'

export const OPTIONS_CONTRACT_ADDRESS = '0x048a64f708011fb5089778204f37d6111bd9bbac0fe4b6e7851292b8cbeeb6ef'
export const ERC20_ADDRESS = '0x07394cbe418daa16e42b87ba67372d4ab4a5df0b05c6e554d158458ce245bc10'

export const OPTIONS_CONTRACT_INSTANCE = new Contract(optionscompiledcontract.abi as any, OPTIONS_CONTRACT_ADDRESS)
export const ERC20_CONTRACT_INSTANCE = new Contract(erc20compiledcontract.abi as any, ERC20_ADDRESS)
