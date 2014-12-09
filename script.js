void(function() {
  'use strict';

  if (!Array.prototype.forEach) return;

  var toArray = function(arrayLike) {
    return [].slice.call(arrayLike);
  };

  var fixTable = function() {

    var table = document.querySelector('table');

    // Remove <hr>s
    toArray(table.querySelectorAll('hr')).forEach(function(hr) {
      var row = hr.parentNode.parentNode;
      row.parentNode.removeChild(row);
    });

    // Make a table head.
    var thead = document.createElement('thead');
    var firstRow = table.querySelector('tr');
    firstRow.parentNode.removeChild(firstRow);
    thead.appendChild(firstRow);
    table.insertBefore(thead, table.firstElementChild);

    var rows = toArray(table.querySelectorAll('tr'));
    rows.forEach(function(row) {
      var first = row.removeChild(row.firstElementChild).firstElementChild;
      var filename = row.firstElementChild;
      filename.insertBefore(first, filename.firstElementChild);
    });

    // Swap special images.
    var special = [{
      icon: '/fancy-index/icons/grunt.svg',
      match: 'gruntfile.js'
    }, {
      icon: '/fancy-index/icons/gulp.png',
      match: 'gulpfile.js'
    }, {
      icon: '/fancy-index/icons/bower.svg',
      match: 'bower.json'
    }, {
      icon: '/fancy-index/icons/gulp.png',
      match: 'gulpfile.js'
    }, {
      icon: '/fancy-index/icons/npm.svg',
      match: 'package.json'
    }];
    toArray(table.querySelectorAll('.indexcolname')).forEach(function(cell) {
      for (var i = 0, len = special.length; i < len; i++) {
        if (cell.textContent.match(new RegExp(special[i].match, 'i'))) {
          cell.querySelector('img').src = special[i].icon;
          return;
        }
      }
    });
  };

  // Underscore string's titleize.
  var titleize = function(str) {
    return str.toLowerCase().replace(/(?:^|\s|-)\S/g, function(c) {
      return c.toUpperCase();
    });
  };

  var addTitle = function() {
    var path = window.location.pathname.replace(/\/$/g, '');
    var titleText;

    if (path) {
      var parts = path.split('/');
      path = parts[parts.length - 1];
      titleText = titleize(path).replace(/\-|\_/g, ' ');

    } else {
      titleText = window.location.host;
    }

    titleText = 'Index of ' + titleText;

    var h1 = document.createElement('h1');
    h1.appendChild(document.createTextNode(titleText));
    h1.style.cssText = 'width:93%;margin-left:auto;margin-right:auto;';
    document.body.insertBefore(h1, document.body.firstChild);
    document.title = titleText;
  };

  var getTimeSince = function(seconds) {
    var intervalType;

    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      intervalType = 'year';
    } else {
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
        intervalType = 'month';
      } else {
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          intervalType = 'day';
        } else {
          interval = Math.floor(seconds / 3600);
          if (interval >= 1) {
            intervalType = 'hour';
          } else {
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
              intervalType = 'minute';
            } else {
              interval = seconds;
              intervalType = 'second';
            }
          }
        }
      }
    }

    if (interval > 1 || interval === 0) {
      intervalType += 's';
    }

    return interval + ' ' + intervalType;
  };

  var fixTime = function() {
    var dates = toArray(document.querySelectorAll('.indexcollastmod'));
    var now = new Date();
    dates.forEach(function(date, i) {
      var stamp = date.textContent.trim();
      if (!stamp || i === 0) return;

      var time = new Date(stamp);
      var difference = Math.round((now.getTime() - time.getTime()) / 1000);
      date.textContent = getTimeSince(difference) + ' ago';
    });
  };

  fixTable();
  addTitle();
  fixTime();

})();
