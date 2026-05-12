import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaCode, FaLightbulb, FaTrophy } from 'react-icons/fa';

const InteractiveDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = [
    {
      title: "AI Assessment",
      description: "Our AI analyzes your current skill level",
      icon: <FaLightbulb className="text-yellow-400" />,
      animation: "pulse"
    },
    {
      title: "Personalized Path",
      description: "Creates a custom learning journey just for you",
      icon: <FaCode className="text-blue-400" />,
      animation: "bounce"
    },
    {
      title: "Interactive Learning",
      description: "Engage with adaptive content and real-time feedback",
      icon: <FaPlay className="text-green-400" />,
      animation: "spin"
    },
    {
      title: "Achievement Unlocked",
      description: "Earn badges and track your progress",
      icon: <FaTrophy className="text-purple-400" />,
      animation: "tada"
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  return (
    <motion.div
      className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-primary mb-2">How It Works</h3>
        <p className="text-gray-600">Experience the future of learning</p>
      </div>

      <div className="relative h-48 mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4"
              animate={steps[currentStep].animation === "spin" ? { rotate: 360 } :
                      steps[currentStep].animation === "bounce" ? { y: [0, -10, 0] } :
                      steps[currentStep].animation === "pulse" ? { scale: [1, 1.1, 1] } :
                      { scale: [1, 1.2, 1, 1.2, 1] }}
              transition={{
                duration: steps[currentStep].animation === "spin" ? 2 : 1,
                repeat: steps[currentStep].animation === "spin" ? Infinity :
                       steps[currentStep].animation === "pulse" ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              {steps[currentStep].icon}
            </motion.div>
            <h4 className="text-lg font-semibold text-primary mb-2">
              {steps[currentStep].title}
            </h4>
            <p className="text-gray-600 text-sm">
              {steps[currentStep].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <motion.button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentStep ? 'bg-primary' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentStep(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <motion.button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 bg-primary text-white rounded-full hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isPlaying ? <FaPause className="text-sm" /> : <FaPlay className="text-sm" />}
        </motion.button>
      </div>

      <motion.div
        className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default InteractiveDemo;