import { writeFileSync, readFileSync } from 'fs';
import _ from 'lodash';

import index from './index.js';
import wildcard from './wildcard.js';

let indexSort;
let wildcardSort;

// Add new domains
const newDomains = readFileSync('./contributions/index.txt').toString().split("\n").filter(d => d)
indexSort = _.concat(index, newDomains)

const newWildcardDomains = readFileSync('./contributions/wildcard.txt').toString().split("\n").filter(d => d)
wildcardSort = _.concat(wildcard, newWildcardDomains)

// Remove empty strings
indexSort = indexSort.filter(d => d)
wildcardSort = wildcardSort.filter(d => d)

// Lowercase
indexSort = indexSort.map(domain => { return _.toLower(domain) })
wildcardSort = wildcardSort.map(domain => { return _.toLower(domain) })

// Sort
indexSort.sort()
wildcardSort.sort()

// Dedupe
indexSort = _.uniq(indexSort)
wildcardSort = _.uniq(wildcardSort)

// Remove wildcards
var regexp = new RegExp(/(.+(?:\.[\w-]+\.[\w-]+)+)$/)

indexSort = indexSort
    .filter(domain => {
        if (regexp.test(domain)) {
            return ! wildcard.filter(wildcard => {
                return _.endsWith(domain, wildcard)
            }).length
        }
        return true
    })

writeFileSync('index.json', JSON.stringify(indexSort, null, 2))
writeFileSync('wildcard.json', JSON.stringify(wildcardSort, null, 2))
