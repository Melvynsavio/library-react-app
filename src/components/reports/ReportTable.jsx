export default function ReportTable({

title,

headers,

rows

}){

return(

<div className="bg-white rounded-3xl shadow-lg p-6">

<h2 className="text-2xl font-bold mb-6">

{title}

</h2>

<div className="overflow-auto">

<table className="w-full">

<thead>

<tr className="bg-slate-100">

{

headers.map(header=>(

<th

key={header}

className="p-4 text-left"

>

{header}

</th>

))

}

</tr>

</thead>

<tbody>

{

rows.map((row,index)=>(

<tr

key={index}

className="border-b"

>

{

row.map((cell,i)=>(

<td

key={i}

className="p-4"

>

{cell}

</td>

))

}

</tr>

))

}

</tbody>

</table>

</div>

</div>

)

}