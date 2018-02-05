{
  function fixTable() {
    const table = document.querySelector('table');

    // Remove <hr>s
    Array.from(table.querySelectorAll('hr')).forEach(({ parentNode }) => {
      const row = parentNode.parentNode;
      row.parentNode.removeChild(row);
    });

    // Make a table head.
    const thead = document.createElement('thead');
    const firstRow = table.querySelector('tr');
    firstRow.parentNode.removeChild(firstRow);
    thead.appendChild(firstRow);
    table.insertBefore(thead, table.firstElementChild);

    // Remove the first column and put the image in the next.
    const rows = Array.from(table.querySelectorAll('tr'));
    rows.forEach((row) => {
      const iconColumn = row.children[0];
      const fileColumn = row.children[1];

      // Remove icon column.
      row.removeChild(iconColumn);

      const image = iconColumn.firstElementChild;

      if (!image) {
        return;
      }

      // Wrap icon in a div.img-wrap.
      const div = document.createElement('div');
      div.className = 'img-wrap';
      div.appendChild(image);

      // Insert icon before filename.
      fileColumn.insertBefore(div, fileColumn.firstElementChild);
    });
  }

  // Underscore string's titleize.
  function titleize(str) {
    return decodeURI(str).toLowerCase().replace(/(?:^|\s|-)\S/g, c => c.toUpperCase());
  }

  function addTitle() {
    let path = window.location.pathname.replace(/\/$/g, '');
    let titleText;

    if (path) {
      const parts = path.split('/');
      path = parts[parts.length - 1];
      titleText = titleize(path).replace(/-|_/g, ' ');
    } else {
      titleText = window.location.host;
    }

    titleText = `Index of ${titleText}`;

    const container = document.createElement('div');
    container.id = 'page-header';
    const h1 = document.createElement('h1');
    h1.appendChild(document.createTextNode(titleText));
    container.appendChild(h1);

    document.body.insertBefore(container, document.body.firstChild);
    document.title = titleText;
  }

  function getTimeSince(seconds) {
    let intervalType;

    let interval = Math.floor(seconds / 31536000);
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

    return `${interval} ${intervalType}`;
  }

  function fixTime() {
    const dates = Array.from(document.querySelectorAll('.indexcollastmod'));
    const now = new Date();
    dates.forEach((date, i) => {
      const stamp = date.textContent.trim();
      if (!stamp || i === 0) return;

      // 2014-12-09 10:43 -> 2014, 11, 09, 10, 43, 0.
      const parts = stamp.split(' ');
      const day = parts[0].split('-');
      const timeOfDay = parts[1].split(':');
      const year = parseInt(day[0], 10);
      const month = parseInt(day[1], 10) - 1;
      const _day = parseInt(day[2], 10);
      const hour = parseInt(timeOfDay[0], 10);
      const minutes = parseInt(timeOfDay[1], 10);

      const time = new Date(year, month, _day, hour, minutes, 0);
      const difference = Math.round((now.getTime() - time.getTime()) / 1000);
      date.textContent = `${getTimeSince(difference)} ago`;
    });
  }

  function addSearch() {
    const input = document.createElement('input');
    input.type = 'search';
    input.id = 'search';
    input.setAttribute('placeholder', 'Search');
    document.getElementById('page-header').appendChild(input);

    const sortColumns = Array.from(document.querySelectorAll('thead a'));
    const nameColumns = Array.from(document.querySelectorAll('tbody .indexcolname'));
    const rows = nameColumns.map(({ parentNode }) => parentNode);
    const fileNames = nameColumns.map(({ textContent }) => textContent);

    function filter(value) {
      // Allow tabbing out of the search input and skipping the sort links
      // when there is a search value.
      sortColumns.forEach((link) => {
        if (value) {
          link.tabIndex = -1;
        } else {
          link.removeAttribute('tabIndex');
        }
      });

      // Test the input against the file/folder name.
      let even = false;
      fileNames.forEach((name, i) => {
        if (!value || name.toLowerCase().includes(value.toLowerCase())) {
          const className = even ? 'even' : '';
          rows[i].className = className;
          even = !even;
        } else {
          rows[i].className = 'hidden';
        }
      });
    }

    document.getElementById('search').addEventListener('input', ({ target }) => {
      filter(target.value);
    });

    filter('');
  }

  fixTable();
  addTitle();
  fixTime();
  addSearch();
}
