# options.js

## Overview

options.js is used to build options to be passed to requests to the node-interface,multisig-server or any other destination.

## Usage

        const req_options = require('options.js');

        req_options.build("interface",_params,"POST",/get_address));

* **destination** : "interface" & "multisig" are predefined. For "interface" and endpoint must also be passed as a parameter.

* **_params** : passed as request body

* **_method** : HTTP Method(GET,POST etc.)

* **endpoint** : only used for "interface"
