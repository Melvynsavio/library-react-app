import { motion } from "framer-motion";

export default function MemberCard({

member,

onEdit,

onDelete

}){

return(

<motion.div

whileHover={{scale:1.03}}

className="bg-white rounded-3xl shadow-xl overflow-hidden"

>

<div className="p-8 text-center">

<img

src={member.avatar}

className="w-28 h-28 rounded-full mx-auto border-4 border-blue-500 object-cover"

/>

<h2 className="text-2xl font-bold mt-5">

{member.name}

</h2>

<p className="text-gray-500">

{member.department}

</p>

<div className="mt-5">

<span

className="bg-blue-100

text-blue-700

px-4

py-2

rounded-full"

>

{member.membership}

</span>

</div>

<div className="mt-6 space-y-2">

<p>

📧 {member.email}

</p>

<p>

📱 {member.phone}

</p>

<p>

📍 {member.address}

</p>

</div>

<div className="mt-6">

{

member.status==="Active"

?

<span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">

Active

</span>

:

<span className="bg-red-100 text-red-700 px-4 py-2 rounded-full">

Inactive

</span>

}

</div>

<div className="flex gap-3 mt-8">

<button

onClick={()=>onEdit(member)}

className="flex-1 bg-green-600 text-white py-3 rounded-xl"

>

Edit

</button>

<button

onClick={()=>onDelete(member.id)}

className="flex-1 bg-red-600 text-white py-3 rounded-xl"

>

Delete

</button>

</div>

</div>

</motion.div>

)

}