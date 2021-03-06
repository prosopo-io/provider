// Copyright (C) 2021-2022 Prosopo (UK) Ltd.
// This file is part of provider <https://github.com/prosopo-io/provider>.
//
// provider is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// provider is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with provider.  If not, see <http://www.gnu.org/licenses/>.
// #!/usr/bin/env node
// import { hexToString, hexToU8a, u8aToHex } from '@polkadot/util'
// import { Environment } from '../src/env'
// import { blake2AsU8a, encodeAddress } from '@polkadot/util-crypto'
// import { Option, GenericAccountId } from '@polkadot/types'
//
// require('dotenv').config()

// async function main () {
//     const env = new Environment(undefined)
//     await env.isReady()
//     const contractApi = new ProsopoContractApi(env)
//     const serviceOrigin = 'http://localhost:8282'
//     const dappContract = '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y'
//     const mnemonic = '//Alice'
//
//     if (mnemonic) {
//         const signerPair = env.network.keyring.addFromMnemonic(mnemonic)
//         const senderAddress = signerPair.address
//         const davePair = env.network.keyring.addFromMnemonic('//Dave')
//         console.log(davePair.address)
//         // let emptyOption: <T extends Codec> (typeName: keyof InterfaceTypes) => Option<T>;
//         const args = [serviceOrigin, dappContract, new Option(env.network.registry, GenericAccountId)]
//         const method = 'dappRegister'
//         const encodedArgs = contractApi.encodeArgs(method, args)
//         console.log(new Option(env.network.registry, GenericAccountId).toU8a())
//         // console.log(u8aToHex(encodedArgs));
//         console.log(encodedArgs)
//         const populatedTx = await env.contract?.populateTransaction.dappRegister(...encodedArgs, { gasLimit: 8705000000 })
//         console.log(encodeAddress(populatedTx!.callParams!.dest))
//         console.log(populatedTx!.callParams!.gasLimit.toString())
//         console.log(u8aToHex(populatedTx!.callParams!.inputData))
//         const payload = u8aToHex(populatedTx!.callParams!.inputData)
//         console.log('Payload generated with no signer present in environment\n')
//         console.log(`Payload: ${payload}`)
//         await env.changeSigner(mnemonic)
//         const signature = signerPair.sign(hexToU8a(payload), { withType: true })
//         console.log(`Signature: ${u8aToHex(signature)}`)
//         console.log(`Decoding 0x42b45efa: ${hexToString('0x42b45efa')}`)
//         console.log(`Decoding 0x1501: ${hexToString('0x1501')}`)
//         // decodeU8a
//         console.log(new Option(env.network.registry, GenericAccountId, null).toU8a())
//         process.exit(0)
//     }
// }
//
// main()
//     .catch((error) => {
//         console.error(error)
//         process.exit()
//     })
