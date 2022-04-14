import {ApiPromise, WsProvider} from '@polkadot/api';
import Keyring from "@polkadot/keyring";
import {Network, NetworkUserConfig} from '../types'
import {Signer as AccountSigner} from '../signer/account-signer'
import {KeyringPair} from "@polkadot/keyring/types";
import {Signer} from '../signer/signer';

export function createSigner(signer: AccountSigner, pair: KeyringPair) {
    return new Signer(pair, signer);
}

export function addPair(signer: AccountSigner, pair: KeyringPair): KeyringPair {
    return signer.addPair(pair);
}

export async function createNetwork(mnemonic: string | undefined, networkConfig: NetworkUserConfig): Promise<Network> {

    const provider = new WsProvider(networkConfig.endpoint);
    const api = await createApi(provider)
    const registry = api.registry;
    const keyring = new Keyring({
        type: 'sr25519'
    });
    await api.isReadyOrError
    const signer = new AccountSigner();
    let pairs = keyring.getPairs();

    if (networkConfig.accounts)
        signer.init(registry, networkConfig.accounts);
    signer.setUp && signer.setUp();

    let pair
    if (mnemonic) {
        pair = keyring.addFromMnemonic(mnemonic);
        await addPair(signer, pair)
        pairs = keyring.getPairs();
        const findKeyringPair = pairs.find((pairItem) =>
            registry.createType('AccountId', pairItem.address).eq(pairItem.address)
        );
        if (!findKeyringPair && pair) {
            throw new Error(`Can't find the keyringpair for ${pair.address}`);
        }
    }

    return {
        provider: provider,
        api: api,
        registry: registry,
        keyring: keyring,
        keyringPair: pair,
        signer: signer,
        getAddresses: async () => {
            await api.isReady;
            const pairs = signer.getPairs();
            return pairs.map((pair) => {
                return pair.address;
            });
        },
    }
}

export function createApi(
    provider: WsProvider,
) {
    return new ApiPromise({
        provider,
    });
}
