// create the book class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
// UI class: hadle the tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => {
      UI.addBookToList(book);
    });
  }
  static addBookToList(book) {
    const list = document.querySelector(".list-book");

    // create a row
    const row = document.createElement("tr");

    row.innerHTML = `
<td>${book.title}</td>
<td>${book.author}</td>
<td>${book.isbn}</td>
<td><a href="#" class="btn btn-danger delete btn-small"><i class="fas fa-trash"></i></a></td>
`;
    list.appendChild(row);
  }
  // delete book
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }
  // show alerts
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#my-form");
    container.insertBefore(div, form);

    // make vanish in 3 seconds
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }
  // clear fields
  static clearFiels() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

// store class: handle the storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(book, (index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// event lestener: for display books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// event lestener: add book
document.querySelector("#my-form").addEventListener("submit", (e) => {
  e.preventDefault();
  // get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields!", "danger");
  } else {
    // instantiate the book
    const book = new Book(title, author, isbn);

    // add book to UI
    UI.addBookToList(book);

    // add book to store
    Store.addBook(book);

    // show success messages
    UI.showAlert("Book Added", "success");

    // clear fields
    UI.clearFields();
  }
});

// event listener: for remove the book- event proppergation
document.querySelector(".list-book").addEventListener("click", (e) => {
  UI.deleteBook(e.target);

  // Remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // show delete messages
  UI.showAlert("Book Removed", "warning");
});
