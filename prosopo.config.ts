import {ProsopoConfig} from './src/types'

//TODO create types folder and make a types file per category of types
export default {
    defaultEnvironment: "development",
    networks: {
        development: {
            endpoint: "ws://substrate-node:9944",
            contract: {
                address: process.env.CONTRACT_ADDRESS,
                deployer: {
                    address: "//Alice"
                }
            },
        },
    },
    database: {
        development: {
            type: "mongo",
            endpoint: "mongodb://mongodb:27017",
            dbname: "prosopo"
        }
    },

} as ProsopoConfig;