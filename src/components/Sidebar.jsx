import {
FaBook,
FaUsers,
FaChartPie,
FaExchangeAlt,
FaUndo,
FaHome
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

export default function Sidebar(){

const menu=[
{
name:"Dashboard",
icon:<FaHome/>,
path:"/dashboard"
},
{
name:"Books",
icon:<FaBook/>,
path:"/books"
},
{
name:"Members",
icon:<FaUsers/>,
path:"/members"
},
{
name:"Issue Books",
icon:<FaExchangeAlt/>,
path:"/issues"
},
{
name:"Return Books",
icon:<FaUndo/>,
path:"/return"
},
{
name:"Reports",
icon:<FaChartPie/>,
path:"/reports"
}
];

return(

<div className="fixed left-0 top-0 h-screen w-72 bg-linear-to-b from-blue-700 to-indigo-900 text-white shadow-2xl">

<div className="text-center py-10">

<h1 className="text-3xl font-extrabold">

 LibraryX

</h1>

<p className="text-blue-200 mt-2">

Smart Library System

</p>

</div>

<div className="space-y-2 px-5">

{
menu.map(item=>

<NavLink

key={item.name}

to={item.path}

className={({isActive})=>

`flex items-center gap-4 px-5 py-4 rounded-xl transition

${isActive

?

'bg-white text-blue-700 font-bold shadow-lg'

:

'hover:bg-white/10'

}`}

>

<span className="text-xl">

{item.icon}

</span>

{item.name}

</NavLink>

)
}

</div>

<div className="absolute bottom-8 w-full text-center text-blue-200">

Version 2.0

</div>

</div>

);

}