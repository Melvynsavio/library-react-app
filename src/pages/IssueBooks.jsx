import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaBook,
  FaUser,
  FaCalendarAlt,
  FaPlus,
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const API = "http://localhost:3001";

export default function IssueBooks() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [issues, setIssues] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    bookId: "",
    memberId: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ==========================================
  // LOAD DATA
  // ==========================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [booksRes, membersRes, issuesRes] = await Promise.all([
        axios.get(`${API}/books`),
        axios.get(`${API}/members`),
        axios.get(`${API}/issues`),
      ]);

      setBooks(booksRes.data);
      setMembers(membersRes.data);
      setIssues(issuesRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load issue book data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN MODAL
  // ==========================================

  const openModal = () => {
    setForm({
      bookId: "",
      memberId: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: "",
    });

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (!submitting) {
      setShowModal(false);
    }
  };

  // ==========================================
  // ISSUE BOOK
  // ==========================================

  const handleIssueBook = async (e) => {
    e.preventDefault();

    if (!form.bookId) {
      toast.error("Please select a book");
      return;
    }

    if (!form.memberId) {
      toast.error("Please select a member");
      return;
    }

    if (!form.issueDate) {
      toast.error("Please select issue date");
      return;
    }

    if (!form.dueDate) {
      toast.error("Please select due date");
      return;
    }

    if (form.dueDate < form.issueDate) {
      toast.error("Due date cannot be before issue date");
      return;
    }

    const selectedBook = books.find(
      (book) => String(book.id) === String(form.bookId)
    );

    const selectedMember = members.find(
      (member) => String(member.id) === String(form.memberId)
    );

    if (!selectedBook) {
      toast.error("Selected book was not found");
      return;
    }

    if (!selectedMember) {
      toast.error("Selected member was not found");
      return;
    }

    const available = Number(selectedBook.available || 0);

    if (available <= 0) {
      toast.error("This book is currently unavailable");
      return;
    }

    // Prevent duplicate active issue
    const alreadyIssued = issues.some(
      (issue) =>
        String(issue.bookId) === String(selectedBook.id) &&
        String(issue.memberId) === String(selectedMember.id) &&
        issue.status === "Issued"
    );

    if (alreadyIssued) {
      toast.error("This member already has this book issued");
      return;
    }

    try {
      setSubmitting(true);

      // ==========================================
      // 1. CREATE ISSUE RECORD
      // ==========================================

      const issueData = {
        bookId: selectedBook.id,
        bookTitle: selectedBook.title,

        memberId: selectedMember.id,
        memberName: selectedMember.name,

        issueDate: form.issueDate,
        dueDate: form.dueDate,

        returnDate: null,

        status: "Issued",
      };

      await axios.post(`${API}/issues`, issueData);

      // ==========================================
      // 2. DECREASE BOOK AVAILABLE COUNT
      // ==========================================

      const newAvailable = available - 1;

      await axios.patch(`${API}/books/${selectedBook.id}`, {
        available: newAvailable,
        status: newAvailable > 0 ? "Available" : "Issued",
      });

      toast.success("Book issued successfully!");

      setShowModal(false);

      await loadData();
    } catch (error) {
      console.error(error);

      toast.error("Failed to issue book");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredIssues = issues.filter((issue) => {
    const text = `
      ${issue.bookTitle || ""}
      ${issue.memberName || ""}
      ${issue.status || ""}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  // ==========================================
  // STATS
  // ==========================================

  const totalIssued = issues.filter(
    (issue) => issue.status === "Issued"
  ).length;

  const overdueBooks = issues.filter((issue) => {
    if (issue.status !== "Issued") return false;

    if (!issue.dueDate) return false;

    return issue.dueDate < new Date().toISOString().split("T")[0];
  }).length;

  const availableBooks = books.filter(
    (book) => Number(book.available || 0) > 0
  ).length;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors duration-300">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>
          <p className="text-blue-600 font-semibold mb-1">
            Library Management
          </p>

          <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
            Issue Books
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage books currently issued to library members.
          </p>
        </div>

        <button
          onClick={openModal}
          className="
            primary-btn
            flex
            items-center
            justify-center
            gap-3
            shadow-lg
            shadow-blue-500/20
          "
        >
          <FaPlus />
          Issue New Book
        </button>

      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* ISSUED */}

        <div
          className="
            bg-white
            dark:bg-slate-900
            rounded-3xl
            p-6
            shadow-sm
            border
            border-slate-200
            dark:border-slate-800
            transition
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-slate-400">
                Currently Issued
              </p>

              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
                {totalIssued}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <FaBook className="text-blue-600 text-xl" />
            </div>

          </div>

        </div>

        {/* OVERDUE */}

        <div
          className="
            bg-white
            dark:bg-slate-900
            rounded-3xl
            p-6
            shadow-sm
            border
            border-slate-200
            dark:border-slate-800
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-slate-400">
                Overdue
              </p>

              <h2 className="text-3xl font-bold text-red-600 mt-2">
                {overdueBooks}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>

          </div>

        </div>

        {/* AVAILABLE */}

        <div
          className="
            bg-white
            dark:bg-slate-900
            rounded-3xl
            p-6
            shadow-sm
            border
            border-slate-200
            dark:border-slate-800
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 dark:text-slate-400">
                Books Available
              </p>

              <h2 className="text-3xl font-bold text-green-600 mt-2">
                {availableBooks}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div
        className="
          bg-white
          dark:bg-slate-900
          rounded-3xl
          border
          border-slate-200
          dark:border-slate-800
          p-5
          mb-6
        "
      >

        <div className="relative max-w-xl">

          <FaSearch
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Search by book, member or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              pl-12
              pr-5
              py-3
              rounded-2xl
              bg-slate-100
              dark:bg-slate-800
              border
              border-transparent
              focus:border-blue-500
              outline-none
              text-slate-800
              dark:text-white
            "
          />

        </div>

      </div>

      {/* TABLE */}

      <div
        className="
          bg-white
          dark:bg-slate-900
          rounded-3xl
          shadow-sm
          border
          border-slate-200
          dark:border-slate-800
          overflow-hidden
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead
              className="
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                text-white
              "
            >

              <tr>

                <th className="text-left px-6 py-5">
                  Book
                </th>

                <th className="text-left px-6 py-5">
                  Member
                </th>

                <th className="text-left px-6 py-5">
                  Issue Date
                </th>

                <th className="text-left px-6 py-5">
                  Due Date
                </th>

                <th className="text-left px-6 py-5">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center py-16 text-slate-500"
                  >
                    Loading issue records...
                  </td>

                </tr>

              ) : filteredIssues.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center py-16"
                  >

                    <FaBook className="mx-auto text-4xl text-slate-300 mb-4" />

                    <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                      No issue records found
                    </p>

                    <p className="text-slate-400 mt-1">
                      Issue a book to see it here.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredIssues.map((issue) => {

                  const isOverdue =
                    issue.status === "Issued" &&
                    issue.dueDate &&
                    issue.dueDate <
                      new Date().toISOString().split("T")[0];

                  return (

                    <tr
                      key={issue.id}
                      className="
                        border-b
                        border-slate-100
                        dark:border-slate-800
                        hover:bg-slate-50
                        dark:hover:bg-slate-800/60
                        transition
                      "
                    >

                      {/* BOOK */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div
                            className="
                              w-12
                              h-12
                              rounded-2xl
                              bg-blue-100
                              dark:bg-blue-900/40
                              flex
                              items-center
                              justify-center
                            "
                          >

                            <FaBook className="text-blue-600" />

                          </div>

                          <div>

                            <p className="font-bold text-slate-800 dark:text-white">
                              {issue.bookTitle}
                            </p>

                            <p className="text-sm text-slate-400">
                              Book ID: {issue.bookId}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* MEMBER */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              w-10
                              h-10
                              rounded-full
                              bg-indigo-100
                              dark:bg-indigo-900/40
                              flex
                              items-center
                              justify-center
                            "
                          >

                            <FaUser className="text-indigo-600" />

                          </div>

                          <div>

                            <p className="font-semibold text-slate-700 dark:text-slate-200">
                              {issue.memberName}
                            </p>

                            <p className="text-xs text-slate-400">
                              Member ID: {issue.memberId}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* ISSUE DATE */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">

                          <FaCalendarAlt className="text-blue-500" />

                          {issue.issueDate}

                        </div>

                      </td>

                      {/* DUE DATE */}

                      <td className="px-6 py-5">

                        <div
                          className={`flex items-center gap-2 ${
                            isOverdue
                              ? "text-red-600 font-semibold"
                              : "text-slate-600 dark:text-slate-300"
                          }`}
                        >

                          <FaCalendarAlt />

                          {issue.dueDate}

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        {isOverdue ? (

                          <span
                            className="
                              inline-flex
                              items-center
                              gap-2
                              px-4
                              py-2
                              rounded-full
                              bg-red-100
                              text-red-700
                              dark:bg-red-900/30
                              dark:text-red-400
                              font-semibold
                              text-sm
                            "
                          >

                            <FaExclamationTriangle />

                            Overdue

                          </span>

                        ) : (

                          <span
                            className="
                              inline-flex
                              items-center
                              gap-2
                              px-4
                              py-2
                              rounded-full
                              bg-green-100
                              text-green-700
                              dark:bg-green-900/30
                              dark:text-green-400
                              font-semibold
                              text-sm
                            "
                          >

                            <FaCheckCircle />

                            {issue.status}

                          </span>

                        )}

                      </td>

                    </tr>

                  );

                })

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ======================================
          ISSUE MODAL
      ====================================== */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-slate-950/60
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-5
          "
        >

          <div
            className="
              w-full
              max-w-2xl
              bg-white
              dark:bg-slate-900
              rounded-3xl
              shadow-2xl
              overflow-hidden
            "
          >

            {/* MODAL HEADER */}

            <div
              className="
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                p-6
                text-white
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h2 className="text-2xl font-bold">
                  Issue a Book
                </h2>

                <p className="text-blue-100 mt-1">
                  Assign a book to a library member
                </p>

              </div>

              <button
                onClick={closeModal}
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-white/20
                  hover:bg-white/30
                  flex
                  items-center
                  justify-center
                  transition
                "
              >

                <FaTimes />

              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleIssueBook}
              className="p-7 space-y-6"
            >

              {/* BOOK */}

              <div>

                <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-200">
                  Select Book
                </label>

                <div className="relative">

                  <FaBook
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-blue-500
                    "
                  />

                  <select
                    name="bookId"
                    value={form.bookId}
                    onChange={handleChange}
                    className="
                      w-full
                      pl-11
                      pr-5
                      py-3.5
                      rounded-2xl
                      border
                      border-slate-300
                      dark:border-slate-700
                      bg-white
                      dark:bg-slate-800
                      text-slate-800
                      dark:text-white
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  >

                    <option value="">
                      Choose a book
                    </option>

                    {books.map((book) => (

                      <option
                        key={book.id}
                        value={book.id}
                        disabled={Number(book.available || 0) <= 0}
                      >

                        {book.title} — Available: {book.available || 0}

                      </option>

                    ))}

                  </select>

                </div>

              </div>

              {/* MEMBER */}

              <div>

                <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-200">
                  Select Member
                </label>

                <div className="relative">

                  <FaUser
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-indigo-500
                    "
                  />

                  <select
                    name="memberId"
                    value={form.memberId}
                    onChange={handleChange}
                    className="
                      w-full
                      pl-11
                      pr-5
                      py-3.5
                      rounded-2xl
                      border
                      border-slate-300
                      dark:border-slate-700
                      bg-white
                      dark:bg-slate-800
                      text-slate-800
                      dark:text-white
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  >

                    <option value="">
                      Choose a member
                    </option>

                    {members.map((member) => (

                      <option
                        key={member.id}
                        value={member.id}
                      >

                        {member.name} — {member.email}

                      </option>

                    ))}

                  </select>

                </div>

              </div>

              {/* DATES */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-200">
                    Issue Date
                  </label>

                  <input
                    type="date"
                    name="issueDate"
                    value={form.issueDate}
                    onChange={handleChange}
                    className="
                      w-full
                      px-4
                      py-3.5
                      rounded-2xl
                      border
                      border-slate-300
                      dark:border-slate-700
                      bg-white
                      dark:bg-slate-800
                      text-slate-800
                      dark:text-white
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

                <div>

                  <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-200">
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    min={form.issueDate}
                    onChange={handleChange}
                    className="
                      w-full
                      px-4
                      py-3.5
                      rounded-2xl
                      border
                      border-slate-300
                      dark:border-slate-700
                      bg-white
                      dark:bg-slate-800
                      text-slate-800
                      dark:text-white
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex justify-end gap-4 pt-3">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="
                    px-6
                    py-3
                    rounded-xl
                    border
                    border-slate-300
                    dark:border-slate-700
                    text-slate-600
                    dark:text-slate-300
                    hover:bg-slate-100
                    dark:hover:bg-slate-800
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    primary-btn
                    min-w-40
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  {submitting ? (
                    "Issuing..."
                  ) : (
                    <>
                      <FaCheckCircle />
                      Issue Book
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}