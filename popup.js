document.addEventListener('DOMContentLoaded', function () {
  // Load bookmarks from storage
  chrome.storage.sync.get(['bookmarks'], function (result) {
    const bookmarks = result.bookmarks || [];
    const bookmarkList = document.getElementById('bookmarkList');

    // Display bookmarks in the popup
    bookmarks.forEach(bookmark => {
      const listItem = document.createElement('div');
      listItem.textContent = bookmark.page + ': ' + bookmark.comment;

      // Add a delete button for each bookmark
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function () {
        deleteBookmark(bookmark);
        listItem.remove();
      });

      listItem.appendChild(deleteButton);
      bookmarkList.appendChild(listItem);
    });
  });

  // Add bookmark button event listener
  document.getElementById('addBookmark').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const page = tabs[0].title;
      const comment = prompt('Enter a comment for this bookmark:');
      if (comment !== null) {
        const bookmark = { page, comment };

        // Save the bookmark to storage
        saveBookmark(bookmark);

        // Add the bookmark to the popup
        const listItem = document.createElement('div');
        listItem.textContent = bookmark.page + ': ' + bookmark.comment;

        // Add a delete button for the bookmark
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
          deleteBookmark(bookmark);
          listItem.remove();
        });

        listItem.appendChild(deleteButton);
        document.getElementById('bookmarkList').appendChild(listItem);
      }
    });
  });

  // Save a bookmark to storage
  function saveBookmark(bookmark) {
    chrome.storage.sync.get(['bookmarks'], function (result) {
      const bookmarks = result.bookmarks || [];
      bookmarks.push(bookmark);
      chrome.storage.sync.set({ 'bookmarks': bookmarks });
    });
  }

  // Delete a bookmark from storage
  function deleteBookmark(bookmarkToDelete) {
    chrome.storage.sync.get(['bookmarks'], function (result) {
      const bookmarks = result.bookmarks || [];
      const updatedBookmarks = bookmarks.filter(bookmark => {
        return !(bookmark.page === bookmarkToDelete.page && bookmark.comment === bookmarkToDelete.comment);
      });
      chrome.storage.sync.set({ 'bookmarks': updatedBookmarks });
    });
  }
});
