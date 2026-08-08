import {
FaEdit,
FaTrash,
FaEye
} from "react-icons/fa";

export default function ActionButtons({

onView,
onEdit,
onDelete

}){

return(

<div className="flex gap-3">

<button

onClick={onView}

className="
w-10
h-10
rounded-xl
bg-blue-100
text-blue-700
hover:bg-blue-600
hover:text-white
transition
"

>

<FaEye className="mx-auto"/>

</button>

<button

onClick={onEdit}

className="
w-10
h-10
rounded-xl
bg-yellow-100
text-yellow-700
hover:bg-yellow-500
hover:text-white
transition
"

>

<FaEdit className="mx-auto"/>

</button>

<button

onClick={onDelete}

className="
w-10
h-10
rounded-xl
bg-red-100
text-red-700
hover:bg-red-600
hover:text-white
transition
"

>

<FaTrash className="mx-auto"/>

</button>

</div>

);

}