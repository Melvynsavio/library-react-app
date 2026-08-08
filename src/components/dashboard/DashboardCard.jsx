import { motion } from "framer-motion";

export default function DashboardCard({

title,

value,

icon,

color

}){

return(

<motion.div

whileHover={{scale:1.05}}

className={`${color}
rounded-3xl
p-8
text-white
shadow-xl`}

>

<div className="flex justify-between">

<div>

<p className="text-lg">

{title}

</p>

<h1 className="text-5xl font-bold mt-4">

{value}

</h1>

</div>

<div className="text-6xl">

{icon}

</div>

</div>

</motion.div>

)

}