"use strict";
const fetch = require('node-fetch');
Object.defineProperty(exports, "__esModule", { value: true });
exports.getXataClient = exports.XataClient = void 0;
// Generated by Xata Codegen 0.22.3. Please do not edit.
const client_1 = require("@xata.io/client");
/** @typedef { import('./types').SchemaTables } SchemaTables */
/** @type { SchemaTables } */
const tables = [{ name: "users", columns: [] }];
/** @type { import('../../client/src').ClientConstructor<{}> } */
const DatabaseClient = (0, client_1.buildClient)();
const defaultOptions = {
  databaseURL:
    process.env.XATA_URL,
};
/** @typedef { import('./types').DatabaseSchema } DatabaseSchema */
/** @extends DatabaseClient<DatabaseSchema> */
class XataClient extends DatabaseClient {
  constructor(options) {
    super({ ...defaultOptions, ...options }, tables);
  }
}
exports.XataClient = XataClient;
let instance = undefined;
/** @type { () => XataClient } */
const getXataClient = () => {
  if (instance) return instance;
  instance = new XataClient({fetch: fetch});
  return instance;
};
exports.getXataClient = getXataClient;