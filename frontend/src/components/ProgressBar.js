import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ completed, total, percentage }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">
          {completed}/{total} Lessons
        </span>
        <span className="text-sm font-bold text-secondary">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1 }}
          className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
