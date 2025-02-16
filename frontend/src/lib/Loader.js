"use client";

import { motion } from "framer-motion";

export default function Loader() {
  const dotVariants = {
    hidden: { opacity: 0.3, scale: 0.5 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.2,
        repeat: Infinity,
        repeatType: "reverse",
        duration: 0.6,
      },
    }),
  };

  return (
    <div className="fixed inset-0 flex flex-col gap-4 items-center justify-center bg-green-600 dark:bg-green-200 z-50">
      {/* Large white "C" */}
      <motion.div
        className="text-white text-9xl font-bold"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        C
      </motion.div>

      {/* Loading Dots */}
      <div className="flex space-x-3">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={`dot-${index}`}
            className="w-6 h-6 bg-white rounded-full"
            initial="hidden"
            animate="visible"
            custom={index}
            variants={dotVariants}
          />
        ))}
      </div>

      {/* "CUETbook" text */}
      <motion.div
        className="text-white text-3xl mt-4 font-bold tracking-widest"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        CUETbook
      </motion.div>
    </div>
  );
}
