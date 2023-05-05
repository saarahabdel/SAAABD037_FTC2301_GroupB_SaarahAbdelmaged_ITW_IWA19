// Imports from other files.

import { 
    BOOKS_PER_PAGE,
    authors,
    genres,
    books,
} from "./data.js"

/**
 * fetching html elements using querySelectors and placing them in an object
 * @type {object}
 */
const html = {
    view: {
        mainHtml: document.querySelector('[data-list-items]'),
    },
    scroll: {
        moreButton: document.querySelector('[data-list-button]'),
    },
    preview: {
        summarySubTitle: document.querySelector('[data-list-subtitle]'),
        summaryDescription: document.querySelector('[data-list-description]'),
        summaryList: document.querySelectorAll('[data-preview]'),
        summaryOverlay: document.querySelector('[data-list-active]'),
        summaryBlur: document.querySelector('[data-list-blur]'),
        summaryImage: document.querySelector('[data-list-image]'),
        summaryTitle: document.querySelector('[data-list-title]'),
        summaryClose: document.querySelector('[data-list-close]'),
    },
};


const createPreview = (book_props) => {
    const { author, image, title, id } = book_props;       // extracted with using destruction 

    const newElement = document.createElement('button');
    newElement.className = 'preview';
    newElement.setAttribute('data-preview', id);
    
    // HTML preview of book
    newElement.innerHTML =  /* HTML */`      
        <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${author}</div>
            </div>
        `

    return newElement;
};




const createPreviewsFragment = (array, start, end) => {
    // 'array' is an object array of books with properties.
   // 'start' is a number denoting where to start slice.
  // 'end' is a number denoting where to end slice.

    const booksSlice = array.slice(start, end);   // create slice from book data base

    let previewFragment = document.createDocumentFragment();

    for (let i = 0; i < booksSlice.length; i++) {

        let { author, image, title, id } = booksSlice[i];
        author = authors[author];

        const preview = {
            author,
            id,
            image,
            title,
        };
        previewFragment.appendChild(createPreview(preview)); // preview appended to html fragment
    };
    return previewFragment;  // return html fragment
};

const updateRemaining = (array, page) => {
    // array has total number of books.
    // 'page' is the current page
    let remaining = array.length - (page * BOOKS_PER_PAGE);
    return remaining;
};

const preview = () => {
    /**
     * Node list of all preview buttons.
     * @type {NodeList}
     */
    const summaryList = document.querySelectorAll('[data-preview]');

    [...summaryList].forEach(function (buttons) {
         
        /**
         * Individual preview button.
         * @type {HTMLElement}
         */
        let summaryButton = buttons;
        summaryButton.addEventListener('click', () => {

            /**
             * Gets book id from the html elemnet's id attribute.
             * @type {string}
             */
            let summaryId = summaryButton.getAttribute('data-preview');

            /**
             * Book object with specified id extracted from books array.
             * @type {Object}
             */
            let searchBooks = books.find((book) => book.id === summaryId);

            const { author, image, title, description, published } = searchBooks;

            /**
             * Year of book publication.
             * @type {number}
             */
            let year = new Date(published).getFullYear();

            html.preview.summaryBlur.src = `${image}`;
            html.preview.summaryImage.src = `${image}`;
            html.preview.summaryTitle.innerHTML = `${title}`;
            html.preview.summarySubTitle.innerHTML = `${authors[author]} (${year})`;
            html.preview.summaryDescription.innerHTML = `${description}`;

            html.preview.summaryOverlay.showModal();
        });
    });
    html.preview.summaryClose.addEventListener('click', () => {
        html.preview.summaryOverlay.close();
    });
};



// ONCE PAGE IS LOADED: 

/**
 * Selects and displays the first 36 books from the books array.
 * Sets page number to 0 on page load.
 * Checks if books exists as the books array.
 */

const range = [0, 36]; // Array of range start and end. This range is the range of books to select from the books array on page load.

/**
 * Stores current page number.
 * @type {number}
 */
let page = 1;

/* Checks if books is not empty/undefined, and if it is an array.
 * Changed && to || because both are invalid. 
 */
if (!books || !Array.isArray(books)) throw new Error('Source required');

/* range is an array to check if range is within 0 - 36.
 * Change "< 2" to "=== 2" to avoid future errors.
 */
if (!range && range.length === 2) throw new Error('Range must be an array with two numbers');

/**
 * Blank document fragment which will be appended to the 
 * div with list items denoted by the 'data-list-items' attribute.
 * @type {HTMLElement}
 */
let fragment = createPreviewsFragment(books, 0, 36)

html.view.mainHtml.appendChild(fragment);

window.scrollTo({ top: 0, behavior: 'smooth' }); ///scroll to top on reload.



// FOR SCROLLING OF PAGE

/**
 * Function for book scrolling. If show more button is clicked then the function runs and the next 36 books 
 * are shown. Updates the show more button to show the remaining books that have not been viewed.
 */

let pagesRemaining = books.length - (page * BOOKS_PER_PAGE);

html.scroll.moreButton.innerHTML = /* html */ `
    <span>Show more</span>
    <span class="list__remaining"> (${pagesRemaining > 0 ? pagesRemaining : 0})</span>
`;

html.scroll.moreButton.addEventListener('click', () => {
if (pagesRemaining <= 0) {
    html.scroll.moreButton.disabled;
}else {
    html.view.mainHtml.appendChild(createPreviewsFragment(books, (page * BOOKS_PER_PAGE), (page + 1) * BOOKS_PER_PAGE));
    page = page + 1;
    pagesRemaining = updateRemaining(books, page);

    html.scroll.moreButton.innerHTML = /* html */ `
    <span>Show more</span>
    <span class="list__remaining"> (${pagesRemaining > 0 ? pagesRemaining : 0})</span>
    `
    }
});

// calling show preview function 
preview();









