'use strict';

// Download data from store to 'csv' format
const downloads = () => {
  let data = JSON.parse(localStorage.getItem('m.key')); // Use  
  
  const formatToCsv = (data) => {
    // Convert some 'JSON' to 'CSV' type
    if (typeof data === 'object') {
      return Object.entries(data)
        .map(([key, value]) => {
          return typeof value === 'object'
            ? `${key}, ${formatToCsv(value)}`
            : `${key}, ${value}`;
        })
        .join('\n');
    }
    
    return null;
  };
  
  try{
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/csv;charset=utf8,' + encodeURIComponent(formatToCsv(data)));
    
    a.setAttribute('download', 'spreadsheets.csv'); // Name file
    document.body.appendChild(a);
    a.click();
    
    // Remove items createElement in the download file
    document.body.removeChild(a);
  } catch(e) {
    alert('Your browser does not support this feature. Please use a different browser.');
  }
};



// Handle the search feature on the search bar 
const searchInput = document.querySelector('#inlineFormInputGroup');
const items = document.querySelectorAll('#listItems'); 
const error = document.querySelector('#notFound');

searchInput.addEventListener('input', () => {
  function searchItems(query) {
    return items.forEach((item) => {
      const itemText = item.textContent.toLowerCase();
      if (itemText.includes(query.toLowerCase())) {
        item.style.display = 'block'
        error.style.display = 'none'
      } else {
        item.style.display = 'none'
        error.style.display = 'block'
        error.innerHTML = `Search results '<i>${query
          .split('.')[0]
          .substring(0, 23)} ...</i>' could not be found!`;
      }
    });
  }

  return searchItems(searchInput.value.trim());
});

