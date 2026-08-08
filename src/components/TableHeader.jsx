import { FaSearch, FaPlus } from "react-icons/fa";

export default function TableHeader({
    title,
    search,
    setSearch,
    onAdd,
    buttonText = "Add New"
}) {

    return (

        <div className="flex justify-between items-center mb-8">

            <div>

                <h2 className="text-3xl font-bold text-slate-800">
                    {title}
                </h2>

                <p className="text-slate-500 mt-1">
                    Manage your library efficiently
                </p>

            </div>

            <div className="flex gap-4">

                <div className="relative">

                    <FaSearch
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        className="w-80 pl-12 pr-5 py-3 rounded-full border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Search..."
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                    />

                </div>

                <button
                    onClick={onAdd}
                    className="primary-btn flex items-center gap-3"
                >
                    <FaPlus />
                    {buttonText}
                </button>

            </div>

        </div>

    );

}