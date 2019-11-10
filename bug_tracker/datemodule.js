exports.generateDate = function () {
    let d = new Date();
    let year = d.getFullYear();
    let month = (d.getMonth() + 1);
    let day = d.getDate();
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let seconds = d.getSeconds();

    function addZero(x) {
        if (x < 10) {
        return '0' + x;
        } else {
            return x
        };
    }

    let output = year + '-' + addZero(month) + '-' + addZero(day) + ' ' + addZero(hours) + ':' + addZero(minutes) + ':' + addZero(seconds);

    return output;
  };