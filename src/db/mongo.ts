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
import {Db, Document, Filter, MongoClient} from 'mongodb';

import {Hash} from '@polkadot/types/interfaces';
import {isHex} from '@polkadot/util';

import {ERRORS} from '../errors';
import {Database, DatasetRecord, PendingCaptchaRequestRecord, Tables} from '../types';
import {
  Captcha,
  CaptchaSolution,
  CaptchaStates,
  DatasetWithIdsAndTree,
  DatasetWithIdsAndTreeSchema,
  ProsopoEnvError
} from '@prosopo/contract';
import consola from "consola";

// mongodb://username:password@127.0.0.1:27017
const DEFAULT_ENDPOINT = 'mongodb://127.0.0.1:27017';

/**
 * Returns the Database object through which Providers can put and get captchas
 * @param {string} url          The database endpoint
 * @param {string} dbname       The database name
 * @return {ProsopoDatabase}    Database layer
 */
export class ProsopoDatabase implements Database {
  readonly url: string;

  tables: Tables;

  dbname: string;

  logger: typeof consola

  constructor(url, dbname, logger) {
    this.url = url || DEFAULT_ENDPOINT;
    this.tables = {};
    this.dbname = dbname;
    this.logger = logger
  }

  /**
   * @description Connect to the database and set the dataset and captcha tables
   */
  async connect() {
    try {
      const client: MongoClient = new MongoClient(this.url);

      await client.connect();
      const db: Db = client.db(this.dbname);

      this.tables.dataset = db.collection('dataset');
      this.tables.captchas = db.collection('captchas');
      this.tables.solutions = db.collection('solutions');
      this.tables.responses = db.collection('responses');
      this.tables.pending = db.collection('pending');

    } catch (err) {
      throw new Error(ERRORS.DATABASE.CONNECT_ERROR.message);
    }
  }

  /**
   * @description Load a dataset to the database
   * @param {Dataset}  dataset
   */
  async storeDataset(dataset: DatasetWithIdsAndTree): Promise<void> {
    try {
      const parsedDataset = DatasetWithIdsAndTreeSchema.parse(dataset);
      const datasetDoc = {
        datasetId: parsedDataset.datasetId,
        format: parsedDataset.format,
        tree: parsedDataset.tree
      };

      await this.tables.dataset?.updateOne({_id: parsedDataset.datasetId}, {$set: datasetDoc}, {upsert: true});
      // put the dataset id on each of the captcha docs and remove the solution
      const captchaDocs = parsedDataset.captchas
        .map((captcha, index) => ({
          ...captcha,
          datasetId: parsedDataset.datasetId,
          index
        }));


      // create a bulk upsert operation and execute
      await this.tables.captchas?.bulkWrite(captchaDocs.map((captchaDoc) => ({
        updateOne: {
          filter: {_id: captchaDoc.captchaId},
          update: {$set: captchaDoc},
          upsert: true
        }
      })));

      // insert any captcha solutions into the solutions collection
      const captchaSolutionDocs = parsedDataset.captchas.filter((captcha) => "solution" in captcha)
        .map((captcha) => ({
          captchaId: captcha.captchaId,
          solution: captcha.solution,
          salt: captcha.salt,
          datasetId: parsedDataset.datasetId,
        }));

      // create a bulk upsert operation and execute
      await this.tables.solutions?.bulkWrite(captchaSolutionDocs.map((captchaSolutionDoc) => ({
        updateOne: {
          filter: {_id: captchaSolutionDoc.captchaId},
          update: {$set: captchaSolutionDoc},
          upsert: true
        }
      })));


    } catch (err) {
      throw new Error(`${ERRORS.DATABASE.DATASET_LOAD_FAILED.message}:\n${err}`);
    }
  }

  /**
   * @description Get random captchas that are solved or not solved
   * @param {boolean}  solved    `true` when captcha is solved
   * @param {string}   datasetId  the id of the data set
   * @param {number}   size       the number of records to be returned
   */
  async getRandomCaptcha(solved: boolean, datasetId: Hash | string | Uint8Array, size?: number): Promise<Captcha[] | undefined> {
    if (!isHex(datasetId)) {
      throw new Error(`${ERRORS.DATABASE.INVALID_HASH.message}: datasetId`);
    }
    const sampleSize = size ? Math.abs(Math.trunc(size)) : 1;
    const cursor = this.tables.captchas?.aggregate([
      {$match: {datasetId, solution: {$exists: solved}}},
      {$sample: {size: sampleSize}},
      {
        $project: {
          datasetId: 1, captchaId: 1, items: 1, target: 1
        }
      }
    ]);
    const docs = await cursor?.toArray();

    if (docs && docs.length) {
      // drop the _id field
      return docs.map(({_id, ...keepAttrs}) => keepAttrs) as Captcha[];
    }

    throw new ProsopoEnvError(ERRORS.DATABASE.CAPTCHA_GET_FAILED.message);
  }

  /**
   * @description Get captchas by id
   * @param {string[]} captchaId
   */
  async getCaptchaById(captchaId: string[]): Promise<Captcha[] | undefined> {
    const cursor = this.tables.captchas?.find({_id: {$in: captchaId}});
    const docs = await cursor?.toArray();

    if (docs && docs.length) {
      // drop the _id field
      return docs.map(({_id, ...keepAttrs}) => keepAttrs) as Captcha[];
    }

    throw new ProsopoEnvError(ERRORS.DATABASE.CAPTCHA_GET_FAILED.message);
  }

  /**
   * @description Update a captcha solution
   * @param {Captcha}  captcha
   * @param {string}   datasetId  the id of the data set
   */
  async updateCaptcha(captcha: Captcha, datasetId: Hash | string | Uint8Array): Promise<void> {
    if (!isHex(datasetId)) {
      throw new Error(`${ERRORS.DATABASE.INVALID_HASH.message}: datasetId`);
    }

    await this.tables.captchas?.updateOne(
      {datasetId},
      {$set: captcha},
      {upsert: false}
    );
  }

  /**
   * @description Get a captcha that is solved or not solved
   */
  async getDatasetDetails(datasetId: Hash | string): Promise<DatasetRecord> {
    if (!isHex(datasetId)) {
      throw new Error(`${ERRORS.DATABASE.INVALID_HASH.message}: datasetId`);
    }

    const doc = await this.tables.dataset?.findOne({datasetId});

    if (doc) {
      return doc as DatasetRecord;
    }

    throw new ProsopoEnvError(ERRORS.DATABASE.DATASET_GET_FAILED.message);
  }

  /**
   * @description Store a Dapp User's captcha solution
   */
  async storeDappUserSolution(captchas: CaptchaSolution[], datasetId: string) {
    if (!isHex(datasetId)) {
      throw new Error(`${ERRORS.DATABASE.INVALID_HASH.message}: treeRoot`);
    }

    // create a bulk create operation and execute
    await this.tables.solutions?.bulkWrite(captchas.map((captchaDoc) => ({
      insertOne: {
        document: {
          captchaId: captchaDoc.captchaId,
          solution: captchaDoc.solution,
          salt: captchaDoc.salt,
          datasetId: datasetId
        }
      }
    })));
  }

  /**
   * @description Store a Dapp User's pending record
   */
  async storeDappUserPending(userAccount: string, requestHash: string, salt: string): Promise<void> {
    if (!isHex(requestHash)) {
      throw new Error(`${ERRORS.DATABASE.INVALID_HASH.message}: requestHash`);
    }

    await this.tables.pending?.updateOne(
      {_id: requestHash},
      {$set: {accountId: userAccount, pending: true, salt}},
      {upsert: true}
    );
  }

  /**
   * @description Get a Dapp user's pending record
   */
  async getDappUserPending(requestHash: string): Promise<PendingCaptchaRequestRecord> {
    if (!isHex(requestHash)) {
      throw new Error(`${ERRORS.DATABASE.INVALID_HASH.message}: requestHash`);
    }

    const doc = await this.tables.pending?.findOne({_id: requestHash});

    if (doc) {
      return doc as PendingCaptchaRequestRecord;
    }

    throw new ProsopoEnvError(ERRORS.DATABASE.PENDING_RECORD_NOT_FOUND.message);
  }

  /**
   * @description Update a Dapp User's pending record
   */
  async updateDappUserPendingStatus(userAccount: string, requestHash: string, approve: boolean): Promise<void> {
    if (!isHex(requestHash)) {
      throw new Error(`${ERRORS.DATABASE.INVALID_HASH.message}: requestHash`);
    }

    await this.tables.pending?.updateOne(
      {_id: requestHash},
      {$set: {accountId: userAccount, pending: false, approved: approve}},
      {upsert: true}
    );
  }

  /**
   * @description Get all unsolved captchas
   */
  async getAllCaptchasByDatasetId(datasetId: string, state?: CaptchaStates): Promise<Captcha[] | undefined> {
    let query: Filter<Document> = {
      datasetId
    };

    switch (state) {
      case CaptchaStates.Solved:
        query.solution = {solution: {$exists: true}};
        break;
      case CaptchaStates.Unsolved:
        query.solution = {solution: {$exists: false}};
        break;
    }

    const cursor = this.tables.captchas?.find(query);
    const docs = await cursor?.toArray();

    if (docs) {
      // drop the _id field
      return docs.map(({_id, ...keepAttrs}) => keepAttrs) as Captcha[];
    }

    throw new ProsopoEnvError(ERRORS.DATABASE.CAPTCHA_GET_FAILED.message);
  }

  /**
   * @description Get all dapp user's solutions
   */
  async getAllSolutions(captchaId: string): Promise<CaptchaSolution[] | undefined> {
    const cursor = this.tables.solutions?.find({captchaId});
    const docs = await cursor?.toArray();

    if (docs) {
      // drop the _id field
      return docs.map(({_id, ...keepAttrs}) => keepAttrs) as CaptchaSolution[];
    }

    throw new ProsopoEnvError(ERRORS.DATABASE.SOLUTION_GET_FAILED.message);
  }

  async getDatasetIdWithSolvedCaptchasOfSizeN(solvedCaptchaCount): Promise<string> {

    const cursor = this.tables.solutions?.aggregate([
      {
        $match: {}
      },
      {
        $group: {
          _id: "$datasetId",
          count: {$sum: 1}
        }
      },
      {
        $match:
          {
            'count': {'$gte': solvedCaptchaCount}
          }
      },
      {
        $sample: {size: 1}
      }
    ])

    const docs = await cursor?.toArray();
    if (docs && docs.length) {
      // return the _id field
      return docs[0]._id
    }

    throw new ProsopoEnvError(ERRORS.DATABASE.DATASET_WITH_SOLUTIONS_GET_FAILED.message);

  }

  async getRandomSolvedCaptchasFromSingleDataset(datasetId: string, size: number): Promise<CaptchaSolution[]> {
    //const datasetId = await this.getDatasetIdWithSolvedCaptchasOfSizeN(size);
    if (!isHex(datasetId)) {
      throw new Error(`${ERRORS.DATABASE.INVALID_HASH.message}: datasetId`);
    }

    const sampleSize = size ? Math.abs(Math.trunc(size)) : 1;
    const cursor = this.tables.solutions?.aggregate([
      {$match: {datasetId}},
      {$sample: {size: sampleSize}},
      {
        $project: {
          captchaId: 1, solution: 1,
        }
      }
    ]);
    const docs = await cursor?.toArray();

    if (docs && docs.length) {
      return docs as CaptchaSolution[]
    }

    throw new ProsopoEnvError(ERRORS.DATABASE.SOLUTION_GET_FAILED.message);

  }


}
