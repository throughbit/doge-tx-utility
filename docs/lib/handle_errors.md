# handle_errors.js

**Dependencies**

1*../lib/response_format.js

**Overview**

handle_errors.js is used to organize error handling and list out all possible error cases in one location.

Returns a response in accordance to 1* with 
{ status:false, message:<error_details> }

**Usage**

const errors = require('handle_errors.js');

..}
  .catch((e)=>{
        res.send(errors.handle(e));
  });








