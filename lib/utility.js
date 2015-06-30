var request = require('request');

//abstracted json get request caller method.
function getFromURL(url, isJSON, callback){
  request.get(url, function (err, response, body) {
    if (err) {
      console.log("error fetching info from blockchain info " + err);
      callback(err, null);
    } else {
      try {
        if (isJSON) {
          callback(false, JSON.parse(body));
        } else {
          callback(false, body);
        }
      } 
      catch(err) {
        console.log("error parsing data recieved from blockchain info");
        callback(err, null);
      }
    }
  });
}

module.exports = {
  getFromURL: getFromURL
};