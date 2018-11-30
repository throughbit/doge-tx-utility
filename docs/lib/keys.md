# keys.js

## Overview

keys.js is used to generate a digibyte key-pair and address set.

The generate function takes two parameters:

* **amount** : number of key-pairs |or| threshold
* **isMultiSig** : creates a multi-sig address between all the given pairs if set = 1

## Usage

          const keys = require('keys.js');
          ...
          keys.generate(2,1);


To create a multiSig key-pair and address set:

          node cli.js -keypair 3 1
