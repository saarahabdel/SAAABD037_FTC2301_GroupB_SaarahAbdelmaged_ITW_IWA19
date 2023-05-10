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
 * a button element containing the book preview information in HTML form
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



// GENRES AND AUTHORS DROPDOWN

//When searcButton is clicked, it shows a modal by invoking showModal() on dataSearchOverlay
searchButton.addEventListener('click', () => {
    searchOverlay.showModal()
    searchTitle.focus()
})

//When searchCancel is clicked, it closes modal by invoking close() on dataSearchOverlay
searchCancel.addEventListener('click', () => { 
    searchOverlay.close()
})

// a document fragment for 'genres'
const genresFragment = document.createDocumentFragment()
const genreElement = document.createElement('option')
genreElement.value = 'any'                             // sets the value of the option to "any"
genreElement.innerText = 'All Genres'                  // sets inner text to "All Genres"
genresFragment.appendChild(genreElement)

// loops through an object and creates an option element for each entry, setting the value to the entry's key and the inner text to its value
for (const [id] of Object.entries(genres)) {
    const genreElement = document.createElement('option')
    genreElement.value = id
    genreElement.innerText = genres[id]
    // option elements are added to the fragment
    genresFragment.appendChild(genreElement)
}

// fragment is then appended to a searchGenres element
searchGenres.appendChild(genresFragment)

// a document fragment for 'authors'
const authorsFragment = document.createDocumentFragment()
const authorsElement = document.createElement('option')
authorsElement.value = 'any'                             // sets the value of the option to "any"
authorsElement.innerText = 'All Authors'                 // sets inner text to "All Authors"
authorsFragment.appendChild(authorsElement)

// loops through an object and creates an option element for each entry, setting the value to the entry's key and the inner text to its value
for (const [id] of Object.entries(authors)) {
    const authorsElement = document.createElement('option')
    authorsElement.value = id
    authorsElement.innerText = authors[id]
    // option elements are added to the fragment
    authorsFragment.appendChild(authorsElement)
}

// fragment is then appended to a searchAuthors element
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


