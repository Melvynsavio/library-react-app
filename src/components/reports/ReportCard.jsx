import { motion } from "framer-motion";

export default function ReportCard({

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
shadow-xl
text-white
p-8`}

>

<div className="flex justify-between">

<div>

<p className="text-lg">

{title}

</p>

<h1 className="text-5xl font-bold mt-3">

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