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
import {ProsopoConfig} from './src/types';

export default {
    logLevel: 'info',
    defaultEnvironment: 'development',
    contract: {
        abi: '/usr/src/packages/provider/packages/core/artifacts/prosopo.json'
    },
    networks: {
        development: {
            endpoint: 'ws://substrate-node:9944',
            contract: {
                address: process.env.CONTRACT_ADDRESS,
                deployer: {
                    address: '//Alice'
                },
                name: 'prosopo'

            },
            accounts: [
                '//Alice',
                '//Bob',
                '//Charlie',
                '//Dave',
                '//Eve',
                '//Ferdie'
            ]
        }
    },
    captchas: {
        solved: {
            count: 1
        },
        unsolved: {
            count: 1
        }
    },
    captchaSolutions: {
        requiredNumberOfSolutions: 3,
        solutionWinningPercentage: 80,
        captchaFilePath: '/usr/src/data/captchas.json'
    },
    database: {
        development: {
            type: 'mongo',
            endpoint: `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@provider-db:27017`,
            dbname: 'prosopo'
        }
    }
} as ProsopoConfig;
