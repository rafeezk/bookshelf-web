const bookShelf = [];
const EVENT_CHANGE = 'event';
const STORAGE_KEY = 'BOOKS';

const saveData = () => {
    if (typeof Storage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookShelf));
    } else {
        alert('Sorry;( Please update ur browser!');
    }
}

const formInput = document.getElementById('formSubmit')
formInput.addEventListener('submit', (e) => {
    e.preventDefault()
    addBook()
})

const loadStorage = () => {
    if (typeof Storage !== "undefined") {
        const shelfBooks = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (shelfBooks !== null) {
            for (i of shelfBooks) {
                bookShelf.push(i);
            }
        }
        document.dispatchEvent(new Event(EVENT_CHANGE));
    } else {
        alert('Sorry;( Please update ur browser!');
    }
}

    document.addEventListener('DOMContentLoaded', function () {
        loadStorage();
});

const bookObject = (id, title, writer, year, finished) => {
    return {
        id,
        title,
        writer,
        year,
        finished
    }
}

function addBook() {
    const id = +new Date();
    const inputTitle = document.getElementById('title');
    const inputWriter = document.getElementById('writer');
    const yearInput = document.getElementById('year');
    const year = yearInput.value
    const inputYear = parseInt(year);
    const finishedBook = document.getElementById('check');

    const newBook = bookObject(id, inputTitle.value, inputWriter.value, inputYear, finishedBook.checked);
    bookShelf.push(newBook);
    console.log(bookShelf);
    saveData();
    document.dispatchEvent(new Event(EVENT_CHANGE));
    inputTitle.value = ''
    inputWriter.value = ''
    yearInput.value = ''
    finishedBook.checked = false
}

document.addEventListener(EVENT_CHANGE, () => {
    const uncomplete = document.getElementById('unfinished');
    uncomplete.innerHTML = '';

    const complete = document.getElementById('finished');
    complete.innerHTML = '';

    let totalUnfinished = 0;
    let totalFinished = 0;

    for (const i of bookShelf) {
        const item = makeItem(i);
        if (!i.finished) {
            uncomplete.append(item);
            totalUnfinished++;
        } else {
            complete.append(item);
            totalFinished++;
        }
    }
    const totalBooks = document.getElementById("total-books");
    totalBooks.textContent = totalUnfinished + totalFinished;
})

function makeItem(item) {
    const article = document.createElement('article');
    article.classList.add('article')
    const container = document.createElement('div');
    container.classList.add('container')
    container.className = 'container';

    const title = document.createElement('h2');
    const writer = document.createElement('p');
    const year = document.createElement('p');

    const button1 = document.createElement('button');
    const button2 = document.createElement('button');

    const icon = document.createElement('i');
    icon.className = 'fas fa-repeat'; 
    const icon2 = document.createElement('i');
    icon2.className = 'fas fa-trash';
    button1.classList.add('p-1')
    button2.classList.add('mt-3', 'p-1');
    button1.append(icon);
    button2.append(icon2);
    button1.addEventListener('click', () => {
        if (item.finished) {
            changeStatus(false)(item.id)
        } else {
            changeStatus(true)(item.id)
        }
             console.log('kepencet');
    })
    button2.addEventListener('click', () => {
        deleteBook(item.id)
    })

    title.innerText = `${item.title}`;
    writer.innerText = `${item.writer}`;
    year.innerText = `${item.year}`; 

    container.append(title, writer, year, button1, button2);
    article.append(container);
    return article;
}

const deleteBook = (id) => {
    const findBook = bookShelf.find(item => item.id === id);
    const deleteData = confirm(`Are you sure you want to delete the book ${findBook.title}?`);
    if (deleteData) {
      const index = bookShelf.findIndex((item) => item.id === id);
      bookShelf.splice(index, 1);
      document.dispatchEvent(new Event(EVENT_CHANGE));
      saveData();
      alert(`${findBook.title} has been removed`);
    }
  }

const changeStatus = (readStatus) => (id) => {
    const findItem = bookShelf.find(item => item.id === id);
    if (findItem != undefined) {
      findItem.finished = readStatus;
    }
    document.dispatchEvent(new Event(EVENT_CHANGE));
    saveData();
  }