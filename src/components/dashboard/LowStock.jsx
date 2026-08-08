export default function LowStock({ books }) {

  const lowStockBooks = books.filter(

    book => Number(book.available) <= 2

  );

  return (

    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-red-600 mb-6">

        ⚠ Low Stock Books

      </h2>

      {

        lowStockBooks.length === 0 ?

          (

            <p className="text-green-600 font-medium">

              All books have sufficient stock.

            </p>

          )

          :

          (

            <div className="space-y-4">

              {

                lowStockBooks.map(book => (

                  <div

                    key={book.id}

                    className="flex justify-between items-center border-b pb-3"

                  >

                    <div>

                      <h3 className="font-semibold">

                        {book.title}

                      </h3>

                      <p className="text-gray-500">

                        {book.author}

                      </p>

                    </div>

                    <span className="bg-red-100 text-red-700 px-3 py-2 rounded-full">

                      {book.available} Left

                    </span>

                  </div>

                ))

              }

            </div>

          )

      }

    </div>

  );

}