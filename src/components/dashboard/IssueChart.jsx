import {

BarChart,

Bar,

XAxis,

YAxis,

Tooltip,

ResponsiveContainer

} from "recharts";

export default function IssueChart({

issues

}){

const months={};

issues.forEach(issue=>{

const month=

new Date(issue.issueDate)

.toLocaleString(

"default",

{

month:"short"

}

);

months[month]=(months[month]||0)+1;

});

const data=

Object.keys(months).map(key=>({

month:key,

issues:months[key]

}));

return(

<div className="bg-white rounded-3xl shadow-lg p-6 h-[420px]">

<h2 className="text-2xl font-bold mb-5">

Monthly Issues

</h2>

<ResponsiveContainer>

<BarChart data={data}>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Bar

dataKey="issues"

fill="#2563eb"

/>

</BarChart>

</ResponsiveContainer>

</div>

)

}
