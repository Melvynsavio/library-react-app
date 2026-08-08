import { motion } from "framer-motion";

export default function IssueCard({

    issue,
    book,
    member,
    onReturn

}) {

    const overdue =
        issue.status === "Issued" &&
        new Date(issue.dueDate) < new Date();

    return (

        <motion.div

            whileHover={{ scale:1.03 }}

            className="bg-white rounded-3xl shadow-xl overflow-hidden"

        >

            <div className="p-6">

                <img

                    src={book?.cover}

                    alt={book?.title}

                    className="w-full h-52 object-cover rounded-2xl"

                />

                <h2 className="text-2xl font-bold mt-5">

                    {book?.title}

                </h2>

                <p className="text-gray-500">

                    {member?.name}

                </p>

                <div className="mt-5 space-y-2">

                    <p>

                        📅 Issue :

                        <strong>

                            {" "}{issue.issueDate}

                        </strong>

                    </p>

                    <p>

                        ⏳ Due :

                        <strong>

                            {" "}{issue.dueDate}

                        </strong>

                    </p>

                    <p>

                        📦 Status :

                        {

                            issue.status==="Returned"

                            ?

                            <span className="ml-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">

                                Returned

                            </span>

                            :

                            overdue

                            ?

                            <span className="ml-2 bg-red-100 text-red-700 px-3 py-1 rounded-full">

                                Overdue

                            </span>

                            :

                            <span className="ml-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">

                                Issued

                            </span>

                        }

                    </p>

                </div>

                {

                    issue.status==="Issued"

                    &&

                    <button

                        onClick={()=>onReturn(issue)}

                        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"

                    >

                        Return Book

                    </button>

                }

            </div>

        </motion.div>

    )

}