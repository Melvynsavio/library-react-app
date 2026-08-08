export default function StatusBadge({ status }) {

    let style = "";

    switch (status) {

        case "Available":
            style = "bg-green-100 text-green-700";
            break;

        case "Issued":
            style = "bg-yellow-100 text-yellow-700";
            break;

        case "Returned":
            style = "bg-blue-100 text-blue-700";
            break;

        case "Overdue":
            style = "bg-red-100 text-red-700";
            break;

        default:
            style = "bg-slate-100 text-slate-700";
    }

    return (

        <span
            className={`px-4 py-2 rounded-full font-semibold text-sm ${style}`}
        >
            {status}
        </span>

    );

}