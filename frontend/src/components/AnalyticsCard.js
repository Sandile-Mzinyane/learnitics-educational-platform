import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const AnalyticsCard = ({ title, value, change, icon, color }) => {
  const isPositive = change >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 font-semibold">{title}</h3>
        <div className={`text-2xl ${color.replace('border-', 'text-')}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <FaArrowUp /> : <FaArrowDown />}
          {Math.abs(change)}%
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsCard;
