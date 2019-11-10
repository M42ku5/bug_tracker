exports.generatePostId = function () {
    let d = new Date();
    let n = d.getTime().toString(36).toUpperCase();
    return n;
  };