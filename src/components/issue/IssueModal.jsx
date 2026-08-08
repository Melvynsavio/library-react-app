import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function IssueModal({

isOpen,

books,

members,

onClose,

onSave

}){

const empty={

bookId:"",

memberId:"",

issueDate:"",

dueDate:""

};

const[form,setForm]=useState(empty);

useEffect(()=>{

setForm(empty);

},[isOpen]);

const submit=()=>{

if(!form.bookId){

toast.error("Select Book");

return;

}

if(!form.memberId){

toast.error("Select Member");

return;

}

if(!form.issueDate){

toast.error("Select Issue Date");

return;

}

if(!form.dueDate){

toast.error("Select Due Date");

return;

}

onSave({

...form,

status:"Issued",

returnDate:""

});

};

if(!isOpen) return null;

return(

<div className="fixed inset-0 bg-black/60 flex justify-center items-center">

<div className="bg-white rounded-3xl p-8 w-full max-w-xl">

<h2 className="text-3xl font-bold mb-8">

Issue Book

</h2>

<select

value={form.bookId}

onChange={(e)=>setForm({

...form,

bookId:Number(e.target.value)

})}

className="border rounded-xl p-3 w-full mb-4"

>

<option value="">

Select Book

</option>

{

books

.filter(book=>book.available>0)

.map(book=>(

<option

key={book.id}

value={book.id}

>

{book.title}

</option>

))

}

</select>

<select

value={form.memberId}

onChange={(e)=>setForm({

...form,

memberId:Number(e.target.value)

})}

className="border rounded-xl p-3 w-full mb-4"

>

<option>

Select Member

</option>

{

members.map(member=>(

<option

key={member.id}

value={member.id}

>

{member.name}

</option>

))

}

</select>

<input

type="date"

className="border rounded-xl p-3 w-full mb-4"

value={form.issueDate}

onChange={(e)=>setForm({

...form,

issueDate:e.target.value

})}

/>

<input

type="date"

className="border rounded-xl p-3 w-full"

value={form.dueDate}

onChange={(e)=>setForm({

...form,

dueDate:e.target.value

})}

/>

<div className="flex justify-end gap-4 mt-8">

<button

onClick={onClose}

className="px-6 py-3 rounded-xl bg-gray-300"

>

Cancel

</button>

<button

onClick={submit}

className="px-6 py-3 rounded-xl bg-blue-600 text-white"

>

Issue Book

</button>

</div>

</div>

</div>

)

}