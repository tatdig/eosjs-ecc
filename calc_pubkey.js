#!/usr/bin/node
// EXAMPLE: node calc_pubkey.js 4cZLxRNk6ZLuzH7ZCPdfez7HN7YFsTPPjLK5LDEZ5SVmnSnTsWT
// ./calc_pubkey.js 4cZLxRNk6ZLuzH7ZCPdfez7HN7YFsTPPjLK5LDEZ5SVmnSnTsWT
//WIF:  4cZLxRNk6ZLuzH7ZCPdfez7HN7YFsTPPjLK5LDEZ5SVmnSnTsWT
//Private Key:  cdecd13cc81ff00566a34bb37758befacecdbaabbe86141e4a1804a2af49e60e
//Public key (compressed):  03d3f28b43c6ef8c625d23cf3b8c37167e9ca31b16ed1e097aad1a5a8d9a37e2f5
//Public key:  04d3f28b43c6ef8c625d23cf3b8c37167e9ca31b16ed1e097aad1a5a8d9a37e2f5c20e83ba5615eea11a762e71550cee7e5c0fca9e212578392e647416a3d9bd1f
//Binary address (compressed):  419edb048a4600553e5f04b2753219636f6af5612598a747b7
//Binary address:  41fed09045a339356220519e03c8888570b25bed6e9e32d9d1
//TDCoin address (compressed):  TQTA8zDDrCK36WasNnRZdFaWBz8zzhJwGr
//TDCoin address:  TZCYV2wec9c5TsUDiged8qFSHKgRfR54PA


const ecc = require('eosjs-ecc');
const base58 = require('bs58');
const ripemd160 = require('ripemd160')

const wif = process.argv[2];
console.log("WIF: ", wif);

const privkey = ecc.PrivateKey.fromString(wif);
console.log("Private Key: ", privkey.toBuffer().toString('hex'));

const compressed_pubkey = privkey.toPublic();
const uncompressed_pubkey = compressed_pubkey.toUncompressed();
console.log("Public key (compressed): ", compressed_pubkey.toHex());
console.log("Public key: ", uncompressed_pubkey.toHex());

const hash1 = ecc.sha256(compressed_pubkey.toBuffer());
const hash2 = new ripemd160().update(Buffer.from(hash1, 'hex')).digest('hex');
const hash3 = ecc.sha256(uncompressed_pubkey.toBuffer());
const hash4 = new ripemd160().update(Buffer.from(hash3, 'hex')).digest('hex');
const with_prefix_compressed = '41' + hash2; //dec2hex of 65 TDCOIN
const with_prefix_uncompressed = '41' + hash4; //dec2hex of 65 TDCOIN

const hash5 = ecc.sha256(Buffer.from(with_prefix_compressed, 'hex'));
const hash6 = ecc.sha256(Buffer.from(hash5, 'hex'));
const hash7 = ecc.sha256(Buffer.from(with_prefix_uncompressed, 'hex'));
const hash8 = ecc.sha256(Buffer.from(hash7, 'hex'));
const binary_address_compressed = with_prefix_compressed + hash6.slice(0,8);
const binary_address_uncompressed = with_prefix_uncompressed + hash8.slice(0,8);
console.log("Binary address (compressed): ", binary_address_compressed);
console.log("Binary address: ", binary_address_uncompressed);

const tdcoin_address_compressed = base58.encode(Buffer.from(binary_address_compressed, 'hex'));
const tdcoin_address_uncompressed = base58.encode(Buffer.from(binary_address_uncompressed, 'hex'));
console.log("TDCoin address (compressed): ", tdcoin_address_compressed);
console.log("TDCoin address: ", tdcoin_address_uncompressed);
