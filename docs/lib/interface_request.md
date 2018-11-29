# interface_request.js

**Overview**
interface_request.js is a template for requests made to the node-interface.

It takes two parameters: options and ep_name

options is built in the ../lib/options.js
ep_name is used for clarity in error logging.

**Usage**

const node_interface = require('interface_request.js');

node_interface.req("interface",{},"POST",/new_address);









