import toast from "react-hot-toast";

export default function ReturnModal({

    isOpen,
    issue,
    book,
    member,
    onClose,
    onConfirm

}) {

    if (!isOpen || !issue) return null;

    const today = new Date().toISOString().split("T")[0];

    const handleReturn = () => {

        onConfirm({

            ...issue,

            status: "Returned",

            returnDate: today

        });

        toast.success("Book Returned Successfully");

    };

    return (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

            <div className="bg-white rounded-3xl w-full max-w-lg p-8">

                <h2 className="text-3xl font-bold mb-8">

                    Return Book

                </h2>

                <div className="space-y-5">

                    <div>

                        <label className="text-gray-500">

                            Book

                        </label>

                        <p className="text-xl font-semibold">

                            {book?.title}

                        </p>

                    </div>

                    <div>

                        <label className="text-gray-500">

                            Member

                        </label>

                        <p className="text-xl font-semibold">

                            {member?.name}

                        </p>

                    </div>

                    <div>

                        <label className="text-gray-500">

                            Issue Date

                        </label>

                        <p>

                            {issue.issueDate}

                        </p>

                    </div>

                    <div>

                        <label className="text-gray-500">

                            Due Date

                        </label>

                        <p>

                            {issue.dueDate}

                        </p>

                    </div>

                    <div>

                        <label className="text-gray-500">

                            Return Date

                        </label>

                        <input

                            type="date"

                            value={today}

                            disabled

                            className="border rounded-xl p-3 w-full mt-2"

                        />

                    </div>

                </div>

                <div className="flex justify-end gap-4 mt-10">

                    <button

                        onClick={onClose}

                        className="bg-gray-300 px-6 py-3 rounded-xl"

                    >

                        Cancel

                    </button>

                    <button

                        onClick={handleReturn}

                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"

                    >

                        Confirm Return

                    </button>

                </div>

            </div>

        </div>

    );

}