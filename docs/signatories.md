# signatories.js

## Overview

A single signing server as part of a multiSig transaction architecture.

This serves as the second/third signatory in the transaction.

## Usage

After transaction is built and signed by the first signtory:

          let serialized = transaction.toObject();
          req_options.build("multisig",serialized,"GET","/")
          .then((options)=>{
            request(options,(error,response,body)=>{
              ...
              if (body.status){
                let tx = new digibyte.Transaction(body.message).serialize();
                resolve(tx);//Fully signed
              }
              ...
            })
          })
          ...
