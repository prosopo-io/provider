import {encodeStringAddress} from './util'
import {ERRORS} from './errors'
// @ts-ignore
import yargs from 'yargs'
import {Compact, u128} from '@polkadot/types';
import {addDataset} from "./captcha";


const validateAddress = (argv) => {
    let address
    address = encodeStringAddress(argv.address)
    return {address}
}

const validatePayee = (argv) => {
    let payee = argv.payee[0].toUpperCase() + argv.payee.slice(1,).toLowerCase();
    payee = ["Provider", "Dapp"].indexOf(payee) > -1 ? payee : undefined;
    return {payee}
}

const validateValue = (argv) => {
    if (typeof argv.value === 'number') {
        let value: Compact<u128> = argv.value as Compact<u128>;
        console.log(value);
        return {value}
    } else {
        throw new Error(`${ERRORS.CLI.PARAMETER_ERROR.message}::value::${argv.value}`)
    }
}

export async function processArgs(args, contractApi, env) {
    return yargs
        .usage('Usage: $0 [global options] <command> [options]')
        .option('api', {demand: false, default: false, type: 'boolean'})
        .command('provider_register', 'Register a Provider', (yargs) => {
                return yargs
                    .option('serviceOrigin', {type: 'string', demand: true,})
                    .option('fee', {type: 'number', demand: true,})
                    .option('payee', {type: 'string', demand: true,})
                    .option('address', {type: 'string', demand: true,})
            }, async (argv) => {
                let result = await contractApi.providerRegister(argv.serviceOrigin, argv.fee, argv.payee, argv.address)
                console.log(JSON.stringify(result, null, 2));
            },
            [validateAddress, validatePayee]
        )
        .command('provider_deregister', 'Deregister a Provider', (yargs) => {
                return yargs
                    .option('address', {type: 'string', demand: true,})
            }, async (argv) => {
                try {
                    let result = await contractApi.providerDeregister(argv.address);
                    console.log(JSON.stringify(result, null, 2));
                } catch (err) {
                    console.log(err);
                }
            },
            [validateAddress]
        )
        .command('provider_stake', 'Stake funds as a Provider', (yargs) => {
                return yargs
                    .option('address', {type: 'string', demand: true,})
                    .option('value', {type: 'number', demand: true,})
            }, async (argv) => {
                try {
                    let result = await contractApi.providerStake(argv.value);
                    console.log(JSON.stringify(result, null, 2));
                } catch (err) {
                    console.log(err);
                }
            },
            [validateValue]
        )
        .command('provider_unstake', 'Unstake funds as a Provider', (yargs) => {
                return yargs
                    .option('value', {type: 'number', demand: true,})
            }, async (argv) => {
                try {
                    let result = await contractApi.providerUnstake(argv.value);
                    console.log(JSON.stringify(result, null, 2));
                } catch (err) {
                    console.log(err);
                }
            },
            [validateValue]
        )
        .command('provider_add_data_set', 'Add a dataset as a Provider', (yargs) => {
                return yargs
                    .option('file', {type: 'string', demand: true})
            }, async (argv) => {
                try {
                    let result = await addDataset(env, contractApi, argv.file)
                    console.log(JSON.stringify(result, null, 2));
                } catch (err) {
                    console.log(err);
                }
            },
            []
        )
        .argv
}