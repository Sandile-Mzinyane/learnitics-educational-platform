import React from 'react';
import { FaStar, FaMedal } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BadgeCard = ({ badge, earned }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-6 rounded-2xl text-center ${earned ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-gray-50 border-2 border-gray-200 opacity-50'}`}
    >
      <div className="text-5xl mb-4 flex justify-center">
        {earned ? <FaMedal className="text-yellow-500" /> : <FaStar className="text-gray-400" />}
      </div>
      <h3 className="font-bold text-lg text-gray-800 mb-1">{badge.name}</h3>
      <p className="text-sm text-gray-600">{badge.description}</p>
      {earned && <p className="text-xs text-yellow-600 mt-2 font-semibold">Earned!</p>}
    </motion.div>
  );
};

export default BadgeCard;
