import { Registry } from 'redspot/types/provider'
import { AccountId, Balance, Hash } from '@polkadot/types/interfaces'
import { u16, u32 } from '@polkadot/types'
import Contract from '@redspot/patract/contract'
import { Environment } from '../env'
import { AbiMessage } from '@polkadot/api-contract/types'

export enum GovernanceStatus {
    Active = 'Active', Inactive = 'Inactive', Deactivated = 'Deactivated'
}

export enum Payee {
    Provider,
    Dapp,
    None
}

export interface Provider {
    status: GovernanceStatus,
    balance: Balance,
    fee: u32,
    payee: Payee,
    serviceOrigin: Hash | string,
    captchaDatasetId: Hash | string,
}

export interface Dapp {
    status: GovernanceStatus,
    balance: Balance,
    owner: AccountId,
    minDifficulty: u16,
    clientOrigin: Hash,
}

export interface contractApiInterface {
    env: Environment

    contractCall(contractFunction: string, args: any[], value?: number): Promise<any>

    contractTx(signedContract: Contract, contractMethodName: string, encodedArgs: any[], value: number | undefined)

    contractQuery(signedContract: Contract, contractMethodName: string, encodedArgs: any[]): Promise<any>

    encodeArgs(methodObj: object, args: any[], value?: number): any[]

    getContractMethod(contractMethodName: string): AbiMessage

    getEventNameFromMethodName(contractMethodName: string): string

    getStorage<T>(key: string, decodingFn: (registry: Registry, data: Uint8Array) => T): Promise<T>
}
