# keys.js

**Overview**

keys.js is used to generate a digibyte key-pair and address set.

generate(amount,isMultiSig):  where amount is number of key-pairs and isMultiSig will create a multi-sig address between all the given pairs.

**Usage**

const keys = require('keys.js');

keys.generate(2,1);
