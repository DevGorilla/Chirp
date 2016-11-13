var i = require("./index.js")

var event = {
  "message": "Chirp chirp chirp. Chirp."
};
var context = {done:function(){},
fail:function(){}}
i.handler(event,context);
