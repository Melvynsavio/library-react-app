import {

PieChart,

Pie,

Cell,

Tooltip,

ResponsiveContainer

} from "recharts";

const COLORS=[

"#2563eb",

"#7c3aed",

"#14b8a6",

"#f97316",

"#ef4444"

];

export default function CategoryChart({

books

}){

const categories={};

books.forEach(book=>{

categories[book.category]=

(categories[book.category]||0)+1;

});

const data=

Object.keys(categories).map(key=>({

name:key,

value:categories[key]

}));

return(

<div className="bg-white rounded-3xl shadow-lg p-6 h-[420px]">

<h2 className="text-2xl font-bold mb-5">

Book Categories

</h2>

<ResponsiveContainer>

<PieChart>

<Pie

data={data}

dataKey="value"

outerRadius={120}

label

>

{

data.map((entry,index)=>(

<Cell

key={index}

fill={COLORS[index%COLORS.length]}

/>

))

}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

)

}