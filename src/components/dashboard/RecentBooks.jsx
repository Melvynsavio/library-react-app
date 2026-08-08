import { FaBook } from "react-icons/fa";

export default function RecentBooks({ books }) {
  const recentBooks = [...books]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        📚 Recently Added Books
      </h2>

      {recentBooks.length === 0 ? (
        <p className="text-gray-500">
          No books available.
        </p>
      ) : (
        <div className="space-y-4">

          {recentBooks.map((book) => (

            <div
              key={book.id}
              className="flex items-center gap-4 border-b pb-3"
            >

              {book.cover ? (
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-14 h-20 rounded-lg object-cover"
                />
              ) : (
                <div className="w-14 h-20 bg-slate-200 rounded-lg flex items-center justify-center">
                  <FaBook />
                </div>
              )}

              <div className="flex-1">

                <h3 className="font-semibold">
                  {book.title}
                </h3>

                <p className="text-gray-500 text-sm">
                  {book.author}
                </p>

                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {book.category}
                </span>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}