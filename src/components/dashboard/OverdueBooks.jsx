export default function OverdueBooks({ issues, books, members }) {

  const today = new Date();

  const overdue = issues.filter(issue => {

    return (

      issue.status === "Issued" &&

      new Date(issue.dueDate) < today

    );

  });

  return (

    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-red-600 mb-6">

        📕 Overdue Books

      </h2>

      {

        overdue.length === 0 ?

          (

            <p className="text-green-600">

              No overdue books.

            </p>

          )

          :

          (

            <div className="space-y-5">

              {

                overdue.map(issue => {

                  const book = books.find(

                    b => b.id === issue.bookId

                  );

                  const member = members.find(

                    m => m.id === issue.memberId

                  );

                  return (

                    <div

                      key={issue.id}

                      className="border-l-4 border-red-500 bg-red-50 p-4 rounded-xl"

                    >

                      <h3 className="font-bold">

                        {book?.title}

                      </h3>

                      <p>

                        Borrower :

                        <span className="font-semibold">

                          {" "}{member?.name}

                        </span>

                      </p>

                      <p>

                        Due Date :

                        <span className="text-red-600">

                          {" "}{issue.dueDate}

                        </span>

                      </p>

                    </div>

                  );

                })

              }

            </div>

          )

      }

    </div>

  );

}