export default function IssueSearch({

search,

setSearch,

status,

setStatus

}){

return(

<div className="flex flex-col md:flex-row gap-5">

<input

placeholder="Search Member or Book..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="flex-1 border rounded-xl p-3"

/>

<select

value={status}

onChange={(e)=>setStatus(e.target.value)}

className="border rounded-xl p-3 w-52"

>

<option value="">

All Status

</option>

<option>

Issued

</option>

<option>

Returned

</option>

<option>

Overdue

</option>

</select>

</div>

)

}