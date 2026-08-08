import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaBook } from "react-icons/fa";

export default function BookCard({ book, onEdit, onDelete }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="h-56 bg-slate-100 flex items-center justify-center">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <FaBook className="text-6xl text-slate-400" />
        )}
      </div>

      <div className="p-5">

        <h2 className="text-xl font-bold">{book.title}</h2>

        <p className="text-slate-500">{book.author}</p>

        <div className="mt-3 flex justify-between">

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {book.category}
          </span>

          <span className="font-semibold">
            Qty : {book.available}/{book.quantity}
          </span>

        </div>

        <div className="flex gap-3 mt-6">

          <button
            onClick={() => onEdit(book)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(book.id)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl"
          >
            Delete
          </button>

        </div>

      </div>

    </motion.div>
  );
}