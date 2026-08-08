import { useState, useEffect } from "react";

export default function BookModal({

isOpen,

book,

onClose,

onSave

}){

const emptyBook={

title:"",
author:"",
isbn:"",
category:"",
publisher:"",
year:"",
quantity:"",
cover:""

};

const [form,setForm]=useState(emptyBook);

useEffect(()=>{

if(book){

setForm(book);

}else{

setForm(emptyBook);

}

},[book]);

const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};

if(!isOpen) return null;

return(

<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

<div className="bg-white rounded-3xl w-full max-w-3xl p-8">

<h2 className="text-3xl font-bold mb-8">

{book?"Edit Book":"Add New Book"}

</h2>

<div className="grid md:grid-cols-2 gap-5">

<input
name="title"
placeholder="Book Title"
value={form.title}
onChange={handleChange}
className="border rounded-xl p-3"
/>

<input
name="author"
placeholder="Author"
value={form.author}
onChange={handleChange}
className="border rounded-xl p-3"
/>

<input
name="isbn"
placeholder="ISBN"
value={form.isbn}
onChange={handleChange}
className="border rounded-xl p-3"
/>

<input
name="publisher"
placeholder="Publisher"
value={form.publisher}
onChange={handleChange}
className="border rounded-xl p-3"
/>

<input
name="category"
placeholder="Category"
value={form.category}
onChange={handleChange}
className="border rounded-xl p-3"
/>

<input
name="year"
type="number"
placeholder="Year"
value={form.year}
onChange={handleChange}
className="border rounded-xl p-3"
/>

<input
name="quantity"
type="number"
placeholder="Quantity"
value={form.quantity}
onChange={handleChange}
className="border rounded-xl p-3"
/>

<input
name="cover"
placeholder="Book Cover URL"
value={form.cover}
onChange={handleChange}
className="border rounded-xl p-3"
/>

</div>

<div className="flex justify-end gap-4 mt-8">

<button
onClick={onClose}
className="px-6 py-3 bg-gray-300 rounded-xl"
>

Cancel

</button>

<button
onClick={()=>onSave(form)}
className="px-6 py-3 bg-blue-600 text-white rounded-xl"
>

Save Book

</button>

</div>

</div>

</div>

);

}