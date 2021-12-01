import {Captcha, Dataset, DatasetSchema} from "./types/captcha";
import {ERRORS} from './errors'
import {loadJSONFile} from "./util";
import {Environment} from "./env";

const {u8aConcat, u8aToHex} = require('@polkadot/util');
const {blake2AsU8a} = require('@polkadot/util-crypto');

function hash(data: string): Uint8Array {
    return blake2AsU8a(data);
}

export function hashDataset(captchas: Captcha[]): Uint8Array {
    // each captcha is a leaf in a very wide merkle tree
    const hashes = captchas.map(captcha => hash(captcha['id'] + captcha['solution'] + captcha['salt']));
    return hash(u8aConcat(hashes))
}


export function parseCaptchaDataset(captchaJSON: JSON): Dataset {
    try {
        return DatasetSchema.parse(captchaJSON)
    } catch (err) {
        throw(`${ERRORS.DATASET.PARSE_ERROR}:\n${err}`);
    }
}

export async function addDataset(env: Environment, contractApi, file: string) {
    let dataset = parseCaptchaDataset(loadJSONFile(file));
    let datasetHash = hashDataset(dataset['captchas']);
    await env.db.loadDataset(dataset, u8aToHex(datasetHash));
    return await contractApi.providerAddDataset(datasetHash)
}