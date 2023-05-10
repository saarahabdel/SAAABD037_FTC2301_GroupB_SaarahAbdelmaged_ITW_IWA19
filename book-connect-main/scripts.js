import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";


// Retrieved elements from the DOM using query Selectors
const searchButton = document.querySelector('[data-header-search]')
const searchOverlay = document.querySelector('[data-search-overlay]')
const searchForm = document.querySelector('[data-search-form]')
const searchTitle = document.querySelector('[data-search-title]')
const searchGenres = document.querySelector('[data-search-genres]')
const searchAuthors = document.querySelector('[data-search-authors]')
const searchCancel = document.querySelector('[data-search-cancel]')

const settingsButton = document.querySelector('[data-header-settings]')
const settingsOverlay = document.querySelector('[data-settings-overlay]')
const settingsForm = document.querySelector('[data-settings-form]')
const settingsTheme = document.querySelector('[data-settings-theme]')
const settingsCancel = document.querySelector('[data-settings-cancel]')

const listItems = document.querySelector('[data-list-items]')
const listMessage = document.querySelector('[data-list-message]')
const moreButton = document.querySelector('[data-list-button]')
const listActive = document.querySelector('[data-list-active]')
const listBlur = document.querySelector('[data-list-blur]')
const listImage = document.querySelector('[data-list-image]')
const listTitle = document.querySelector('[data-list-title]')
const listSubtitle = document.querySelector('[data-list-subtitle]')
const listDescription = document.querySelector('[data-list-description]')
const listClose = document.querySelector('[data-list-close]')




// LOADING OF BOOKS

// displays the first 36 books of array and sets page number to 0

let matches = books
let page = 1;     // keeps track of page number
const range = [0, BOOKS_PER_PAGE]  // an array

// Checks if books is not empty/undefined, and if it is an array.
if (!books || !Array.isArray(books)) {   // Changed && to || because both are invalid. 
    throw new Error('Source required')
}

/* range is an array to check if range is within 0 - 36.
 * Change "< 2" to "=== 2" to avoid future errors.
 */
if (!range && range.length === 2) {   
    throw new Error('Range must be an array with two numbers')
}

/**
 * The createPreview() function takes a book preview object and returns 
 * a button element (showPreview) containing the book preview information in HTML form
 *
 * the authorId, id, title and image are extracted via destructuring.
 *
 * A template literate is used to create an html preview of the book.
 *
 * @param {array} preview is an object array with book properties.
 */
function createPreview(preview) {
    const { author: authorId, id, image, title } = preview

    const showPreview = document.createElement('button')
    showPreview.classList = 'preview'
    showPreview.setAttribute('data-preview', id)

    showPreview.innerHTML = /* html */ `
        <img
            class="preview__image"
            src="${image}"
        />

        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[authorId]}</div>
        </div>
    `

    return showPreview
}

const bookFragment = document.createDocumentFragment()

const startIndex = (page - 1) * BOOKS_PER_PAGE
const endIndex = startIndex + BOOKS_PER_PAGE

const bookExtracted = books.slice(startIndex, endIndex)

/**
 * This loop iterates over the book previews to display on the current page, 
 * creates a book preview button using the createPreview function, and 
 * appends the button to the bookFragment container
 */
for (const preview of bookExtracted) {
    const showPreview = createPreview(preview)
    bookFragment.appendChild(showPreview)
}

listItems.appendChild(bookFragment)

/**
 * This sets up a click event listener for the "Show More" button. When clicked, 
 * the code executes the logic to display the next set of book previews.
 */
moreButton.addEventListener('click', () => {
    page++;

    const newStartIndex = (page - 1) * BOOKS_PER_PAGE
    const newEndIndex = newStartIndex + BOOKS_PER_PAGE

    const newBookExtracted = books.slice(newStartIndex, newEndIndex)

    const newBookFragment = document.createDocumentFragment()

    for (const preview of newBookExtracted) {
        const showPreview = createPreview(preview)
        newBookFragment.appendChild(showPreview)
    }

    listItems.appendChild(newBookFragment);

    const remaining = matches.length - page * BOOKS_PER_PAGE;
    moreButton.innerHTML = /* HTML */ `
      <span>Show more</span>
      <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
    `;

    moreButton.disabled = remaining <= 0;
})


moreButton.innerHTML = /* HTML */
    `<span>Show more</span>
    <span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>
    `;



// BOOK SUMMARIES

// When listItems is clicked, it shows a modal by invoking showModal() on dataListActive.
listItems.addEventListener('click', (event) => {
    listActive.showModal()
    let pathArray = Array.from(event.path || event.composedPath())
    let active;
  
    for (const node of pathArray) {
      if (active) break;
      const id = node?.dataset?.preview
      
      for (const singleBook of books) {
        if (singleBook.id === id) {
          active = singleBook
          break;
        }
      }
    }
  
    if (!active) return;
    listImage.src = active.image;
    listBlur.src = active.image;
    listTitle.textContent = active.title; 
    listSubtitle.textContent = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
    listDescription.textContent = active.description;
})


//When listClose is clicked, it closes the modal by invoking close() on dataListActive.
listClose.addEventListener('click', () => {
    listActive.close()
})


/**
 * GENRES AND AUTHORS
 * This code creates a document fragment for each 'genres' and 'authors'.
 * It sets the value of the option to "any" and the inner text to "All Genres" and "All Authors" 
 * respectively. It then loops through an object and creates an option element for each entry, 
 * setting the value to the entry's key and the inner text to its value. 
 * These option elements are added to the fragment, and the fragment is then 
 * appended to a searchGenres element and searchAuthors element.
 */

//When searcButton is clicked, it shows a modal by invoking showModal() on dataSearchOverlay
searchButton.addEventListener('click', () => {
    searchOverlay.showModal()
    searchTitle.focus()
})

//When searchCancel is clicked, it closes modal by invoking close() on dataSearchOverlay
searchCancel.addEventListener('click', () => { 
    searchOverlay.close()
})

const genresFragment = document.createDocumentFragment()
const genreElement = document.createElement('option')
genreElement.value = 'any'
genreElement.innerText = 'All Genres'
genresFragment.appendChild(genreElement)

for (const [id] of Object.entries(genres)) {
    const genreElement = document.createElement('option')
    genreElement.value = id
    genreElement.innerText = genres[id]
    // option elements are added to the fragment
    genresFragment.appendChild(genreElement)
}

searchGenres.appendChild(genresFragment)

const authorsFragment = document.createDocumentFragment()
const authorsElement = document.createElement('option')
authorsElement.value = 'any'
authorsElement.innerText = 'All Authors'
authorsFragment.appendChild(authorsElement)

for (const [id] of Object.entries(authors)) {
    const authorsElement = document.createElement('option')
    authorsElement.value = id
    authorsElement.innerText = authors[id]
    // option elements are added to the fragment
    authorsFragment.appendChild(authorsElement)
}

searchAuthors.appendChild(authorsFragment)

  

// DAY / NIGHT OPTION

settingsButton.addEventListener('click', () => {
    settingsOverlay.showModal()
})

settingsCancel.addEventListener('click', () => { 
    settingsOverlay.close()
})

//The css object defines two themes, 'day' and 'night'
const css = {
    day : ['255, 255, 255', '10, 10, 20'],
    night: ['10, 10, 20', '255, 255, 255']
}

//The value of the settingsTheme input is determined based on whether the user's preferred color scheme is dark or not.
settingsTheme.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'

/**
 * When the form is submitted, the selected object is created by converting the form data to an object using Object.fromEntries(). 
 * Depending on the theme selected, the --color-light and --color-dark CSS variables are 
 * updated with the corresponding light and dark color values from the css object
 */
settingsForm.addEventListener('submit', (event) => { 
    event.preventDefault()
    const formSubmit = new FormData(event.target)
    const selected = Object.fromEntries(formSubmit)

    if (selected.theme === 'night') {
        document.documentElement.style.setProperty('--color-light', css[selected.theme][0])
        document.documentElement.style.setProperty('--color-dark', css[selected.theme][1])     
    } else if (selected.theme === 'day') {
        document.documentElement.style.setProperty('--color-light', css[selected.theme][0])
        document.documentElement.style.setProperty('--color-dark', css[selected.theme][1])
    }

    settingsOverlay.close()
})


