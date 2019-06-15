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

  /**
   * Get the value and unit to use for RelativeTimeFormat.
   * @param {number} seconds Difference in seconds between two dates.
   */
  function getTimeFormatArgs(seconds) {
    const absoluteSeconds = Math.abs(seconds);
    if (absoluteSeconds > 60 * 60 * 24 * 365) {
      return { value: seconds / (60 * 60 * 24 * 365), unit: 'year' };
    }

    if (absoluteSeconds > 60 * 60 * 24 * 30) {
      return { value: seconds / (60 * 60 * 24 * 30), unit: 'month' };
    }

    if (absoluteSeconds > 60 * 60 * 24) {
      return { value: seconds / (60 * 60 * 24), unit: 'day' };
    }

    if (absoluteSeconds > 60 * 60) {
      return { value: seconds / (60 * 60), unit: 'hour' };
    }

    if (absoluteSeconds > 60) {
      return { value: seconds / 60, unit: 'minute' };
    }

    return { value: seconds, unit: 'second' };
  }

  /**
   * Convert the date output from the server to a Date instance.
   * @param {string} str Date string from the server.
   * @return {Date | null}
   */
  function getDateFromString(str) {
    if (!str) {
      return null;
    }

    // 2014-12-09 10:43 -> 2014, 11, 09, 10, 43, 0.
    const parts = str.split(' ');
    const day = parts[0].split('-');
    const timeOfDay = parts[1].split(':');
    const year = parseInt(day[0], 10);
    const month = parseInt(day[1], 10) - 1;
    const _day = parseInt(day[2], 10);
    const hour = parseInt(timeOfDay[0], 10);
    const minutes = parseInt(timeOfDay[1], 10);

    return new Date(year, month, _day, hour, minutes, 0);
  }

  function fixTime() {
    const hasRelativeTimeFormatter = 'RelativeTimeFormat' in Intl;
    if (!hasRelativeTimeFormatter) return;

    const formatter = new Intl.RelativeTimeFormat();
    const now = Date.now();

    Array.from(document.querySelectorAll('.indexcollastmod')).forEach((date, i) => {
      // Skip the first row because it's the link to the parent directory.
      if (i === 0) {
        return;
      }

      const lastModified = getDateFromString(date.textContent.trim());

      if (lastModified && !Number.isNaN(lastModified)) {
        const difference = Math.round((lastModified.getTime() - now) / 1000);
        const relativeFormat = getTimeFormatArgs(difference);
        date.textContent = formatter.format(Math.round(relativeFormat.value), relativeFormat.unit);
      }
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
