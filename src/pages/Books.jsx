import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  FaBook,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

const API_URL = "http://localhost:3001/api";

function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    quantity: 1,
  });

  // ==========================================
  // FETCH BOOKS
  // ==========================================

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/books`);

      setBooks(response.data);
    } catch (error) {
      console.error("FETCH BOOKS ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load books"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // ==========================================
  // FORM INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {
    setEditingBook(null);

    setFormData({
      title: "",
      author: "",
      category: "",
      isbn: "",
      quantity: 1,
    });

    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (book) => {
    setEditingBook(book);

    setFormData({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
      isbn: book.isbn || "",
      quantity: book.quantity || 1,
    });

    setShowModal(true);
  };

  // ==========================================
  // SAVE BOOK
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.author ||
      !formData.category ||
      !formData.quantity
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingBook) {
        await axios.put(
          `${API_URL}/books/${editingBook._id}`,
          formData
        );

        toast.success("Book updated successfully");
      } else {
        await axios.post(
          `${API_URL}/books`,
          {
            ...formData,
            quantity: Number(formData.quantity),
            available: Number(formData.quantity),
          }
        );

        toast.success("Book added successfully");
      }

      setShowModal(false);

      setEditingBook(null);

      setFormData({
        title: "",
        author: "",
        category: "",
        isbn: "",
        quantity: 1,
      });

      fetchBooks();

    } catch (error) {
      console.error("SAVE BOOK ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  // ==========================================
  // DELETE BOOK
  // ==========================================

  const deleteBook = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/books/${id}`);

      toast.success("Book deleted successfully");

      fetchBooks();

    } catch (error) {
      console.error("DELETE BOOK ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete book"
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredBooks = books.filter((book) => {
    const text = search.toLowerCase();

    return (
      book.title?.toLowerCase().includes(text) ||
      book.author?.toLowerCase().includes(text) ||
      book.category?.toLowerCase().includes(text) ||
      book.isbn?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Books
          </h1>

          <p className="text-slate-500 mt-1">
            Manage your library collection
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          <FaPlus />
          Add Book
        </button>

      </div>

      {/* SEARCH */}

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">

        <div className="relative">

          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search by title, author, category or ISBN..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>

      {/* BOOKS */}

      {loading ? (

        <div className="bg-white rounded-2xl p-10 text-center">
          <p className="text-slate-500">
            Loading books...
          </p>
        </div>

      ) : filteredBooks.length === 0 ? (

        <div className="bg-white rounded-2xl p-10 text-center">

          <FaBook className="mx-auto text-4xl text-slate-300 mb-4" />

          <h2 className="text-xl font-semibold text-slate-700">
            No books found
          </h2>

          <p className="text-slate-500 mt-2">
            Add a book to your library collection.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredBooks.map((book) => (

            <div
              key={book._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition p-6"
            >

              {/* BOOK ICON */}

              <div className="flex items-start justify-between">

                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

                  <FaBook className="text-blue-600 text-xl" />

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    book.available > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {book.available > 0
                    ? "Available"
                    : "Issued"}
                </span>

              </div>

              {/* BOOK INFO */}

              <h2 className="text-xl font-bold text-slate-900 mt-5">
                {book.title}
              </h2>

              <p className="text-slate-500 mt-1">
                by {book.author}
              </p>

              <div className="mt-5 space-y-2 text-sm">

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Category
                  </span>

                  <span className="font-medium text-slate-800">
                    {book.category}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    ISBN
                  </span>

                  <span className="font-medium text-slate-800">
                    {book.isbn || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Quantity
                  </span>

                  <span className="font-medium text-slate-800">
                    {book.quantity}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Available
                  </span>

                  <span className="font-bold text-blue-600">
                    {book.available}
                  </span>
                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() =>
                    openEditModal(book)
                  }
                  className="flex-1 flex items-center justify-center gap-2 border border-blue-200 text-blue-600 hover:bg-blue-50 py-2.5 rounded-xl font-medium transition"
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteBook(book._id)
                  }
                  className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl font-medium transition"
                >
                  <FaTrash />
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between p-6 border-b">

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  {editingBook
                    ? "Edit Book"
                    : "Add New Book"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {editingBook
                    ? "Update book information"
                    : "Add a new book to the library"}
                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center"
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Book title"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Author *
                </label>

                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Author name"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category *
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Technology"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ISBN
                </label>

                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="ISBN number"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Quantity *
                </label>

                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700"
                >
                  {editingBook
                    ? "Update Book"
                    : "Add Book"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Books;