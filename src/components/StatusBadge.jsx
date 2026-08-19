export default function StatusBadge({ status }) {

    const styles = {
        Available: "bg-green-100 text-green-700",
        Issued: "bg-yellow-100 text-yellow-700",
        Returned: "bg-blue-100 text-blue-700",
        Overdue: "bg-red-100 text-red-700",
    };
    const style = styles[status] || "bg-slate-100 text-slate-700";

    return (

        <span
            className={`px-4 py-2 rounded-full font-semibold text-sm ${style}`}
        >
            {status}
        </span>

    );

}
