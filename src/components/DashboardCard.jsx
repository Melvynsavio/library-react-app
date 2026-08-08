import { motion } from "framer-motion";

export default function DashboardCard({
  title,
  value,
  icon,
  color
}) {
  return (

    <motion.div

      whileHover={{
        y: -8,
        scale: 1.03
      }}

      className="
        bg-white
        rounded-3xl
        shadow-lg
        p-7
        flex
        justify-between
        items-center
      "

    >

      <div>

        <p className="text-slate-500">
          {title}
        </p>

        <h2 className="text-4xl font-bold mt-3">
          {value}
        </h2>

      </div>

      <div
        className="
          w-20
          h-20
          rounded-3xl
          flex
          items-center
          justify-center
          text-white
          text-3xl
        "
        style={{
          background: color
        }}
      >
        {icon}
      </div>

    </motion.div>

  );
}