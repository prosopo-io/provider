import Contract from '@redspot/patract/contract'
import { Network, Signer } from 'redspot/types'
import { ProsopoConfig } from './config'
import { Database } from './db'

export interface ProsopoEnvironment {
    network: Network
    contract?: Contract
    config: ProsopoConfig,
    db: Database | undefined,
    mnemonic: string
    signer?: Signer | undefined
    deployerAddress: string
    contractAddress: string
    defaultEnvironment: string
}
