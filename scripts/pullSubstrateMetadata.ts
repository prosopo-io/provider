import { exec } from 'child_process'
import { Environment } from '../src/env'
import fetch from 'cross-fetch'
require('dotenv').config()

async function pullMetadata () {
    const env = new Environment('//Alice')
    await env.isReady()
    // WIP!
    // const endpoint = env.network.config
    // console.log(endpoint)
    // for local dev:
    // const endpoint = 'ws://localhost:9933'
    // const res = await fetch(endpoint.network.endpoint!, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //         id: '1',
    //         jsonrpc: '2.0',
    //         method: 'state_getMetadata',
    //         params: []
    //     })
    // })
    // console.log((await res.json()))
    // await new Promise<void>((resolve) => {
    //     exec('curl -i -N -H "Content-Type: application/json" -H "Connection: Upgrade" -H "Upgrade: websocket" -d \'{"id":"1", "jsonrpc":"2.0", "method": "state_getMetadata", "params":[]}\' ' +
    //     endpoint +
    //     ' -o metadata.json',
    //     {},
    //     (error) => {
    //         if (error) {
    //             console.log(`error: ${error.message}`)
    //         }
    //         resolve()
    //     })
    // })

    process.exit()
}

pullMetadata().catch((err) => {
    throw new Error(`Pull Substrate Metadata error: ${err}`)
})
