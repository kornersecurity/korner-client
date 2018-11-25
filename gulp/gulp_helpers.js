/**
 * Gulp Tasks
 *
 *  (c) 2014 PatrolTag Inc. All rights reserved. http://kornersafe.com
 *  Created by Dan Jones (dan@kornersafe.com)
 *
 */

/**
 * @description
 *
 * helper function that are shared across muliple tasks
 *
 */
var errorsHelper = require("./errorsHelper.js");

// Error handler
module.exports.handleError = function (err) {
  console.log(err.toString());
  errorsHelper.errors += err.toString() + "\n";
  this.emit("end");
};



module.exports.splitComponentFilesByType = function (filesArray) {
  var jsComponents = [];
  var cssComponents = [];
  var fontsComponents = [];

  for (var i = 0; i < filesArray.length; i++) {

    // console.log(filesArray[i] + ' IS JS:   '+(/\.js/i.test(filesArray[i])));
    // console.log(filesArray[i] + ' IS CSS:  '+(/\.css/i.test(filesArray[i])));
    // console.log(filesArray[i] + ' IS FONT: '+(/\/fonts/i.test(filesArray[i])));

    if (/\.js/i.test(filesArray[i])) {
      //Returning true if it's just numbers
      jsComponents.push(filesArray[i]);
    }
    else if (/\.css/i.test(filesArray[i])) {
      cssComponents.push(filesArray[i]);
    }
    else if (/\/fonts\//i.test(filesArray[i])) {
      fontsComponents.push(filesArray[i]);
    }
  }
  return { jsComponents: jsComponents, cssComponents: cssComponents, fontsComponents: fontsComponents };
};
