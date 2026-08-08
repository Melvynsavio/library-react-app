import { useEffect, useState } from "react";
import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function ReturnBooks() {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const issuesRes = await api.get("/issues");
      const booksRes = await api.get("/books");
      const membersRes = await api.get("/members");

      setIssues(issuesRes.data);
      setBooks(booksRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const returnBook = async (issue) => {
    try {
      // Update issue status
      await api.put(`/issues/${issue.id}`, {
        ...issue,
        status: "Returned",
        returnDate: new Date().toISOString().split("T")[0]
      });

      // Increase available book count
      const book = books.find((b) => b.id === issue.bookId);

      if (book) {
        await api.put(`/books/${book.id}`, {
          ...book,
          available: Number(book.available) + 1
        });
      }

      loadData();
      alert("Book returned successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to return book.");
    }
  };

  const activeIssues = issues.filter(
    (issue) => issue.status === "Issued"
  );

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1 ml-72">

        <Navbar />

        <div className="p-8">

          <h1 className="text-4xl font-bold mb-8">
            Return Books
          </h1>

          <div className="overflow-x-auto bg-white rounded-3xl shadow-lg">

            <table className="w-full">

              <thead className="bg-blue-600 text-white">

                <tr>

                  <th className="p-4">Book</th>

                  <th className="p-4">Member</th>

                  <th className="p-4">Issue Date</th>

                  <th className="p-4">Due Date</th>

                  <th className="p-4">Status</th>

                  <th className="p-4">Action</th>

                </tr>

              </thead>

              <tbody>

                {activeIssues.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center p-8"
                    >
                      No books to return.
                    </td>
                  </tr>
                ) : (
                  activeIssues.map((issue) => {
                    const book = books.find(
                      (b) => b.id === issue.bookId
                    );

                    const member = members.find(
                      (m) => m.id === issue.memberId
                    );

                    return (
                      <tr
                        key={issue.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-4">
                          {book?.title}
                        </td>

                        <td className="p-4">
                          {member?.name}
                        </td>

                        <td className="p-4">
                          {issue.issueDate}
                        </td>

                        <td className="p-4">
                          {issue.dueDate}
                        </td>

                        <td className="p-4">
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                            {issue.status}
                          </span>
                        </td>

                        <td className="p-4">

                          <button
                            onClick={() => returnBook(issue)}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl"
                          >
                            Return
                          </button>

                        </td>

                      </tr>
                    );
                  })
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}