import React, { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FaChartBar, FaUsers, FaAward, FaShieldAlt, FaPlay, FaStar, FaRocket, FaCode, FaLightbulb, FaTrophy, FaBrain, FaGlobe, FaCheckCircle } from 'react-icons/fa';
import '../App.css';

// Custom hooks for advanced functionality
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return mousePosition;
};

const useIntersectionObserver = (ref, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

// Lazy loaded components for performance
const InteractiveDemo = lazy(() => import('../components/InteractiveDemo'));
const ParticleSystem = lazy(() => import('../components/ParticleSystem'));

const LandingPage = () => {
  const mousePosition = useMousePosition();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const [currentFeature, setCurrentFeature] = useState(0);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const springOpacity = useSpring(opacity, { stiffness: 300, damping: 30 });

  const isFeaturesVisible = useIntersectionObserver(featuresRef);

  const fadeInUp = useMemo(() => ({
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  }), []);

  const staggerContainer = useMemo(() => ({
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const features = useMemo(() => [
    {
      icon: <FaBrain className="text-4xl" />,
      title: "Adaptive Learning",
      description: "Advanced algorithms adapt to your learning style and pace, providing personalized recommendations",
      gradient: "from-cyan-500 to-blue-600",
      tech: "Smart Technology"
    },
    {
      icon: <FaChartBar className="text-4xl" />,
      title: "Real-time Analytics",
      description: "Track your progress with detailed performance insights and predictive learning paths",
      gradient: "from-emerald-500 to-green-600",
      tech: "Data Science"
    },
    {
      icon: <FaUsers className="text-4xl" />,
      title: "Collaborative Learning",
      description: "Connect with peers and mentors in interactive study groups and discussion forums",
      gradient: "from-violet-500 to-purple-600",
      tech: "Social Learning"
    },
    {
      icon: <FaAward className="text-4xl" />,
      title: "Gamified Experience",
      description: "Earn badges, unlock achievements, and compete on leaderboards while learning",
      gradient: "from-amber-500 to-orange-600",
      tech: "Game Design"
    },
    {
      icon: <FaGlobe className="text-4xl" />,
      title: "Global Accessibility",
      description: "Learn in multiple languages with offline access and cross-device synchronization",
      gradient: "from-rose-500 to-pink-600",
      tech: "Cloud Computing"
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption and privacy protection for all your learning data",
      gradient: "from-indigo-500 to-blue-700",
      tech: "Cybersecurity"
    }
  ], []);

  // Auto-rotate features
  useEffect(() => {
    if (!isFeaturesVisible) return;

    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isFeaturesVisible, features.length]);

  const stats = useMemo(() => [
    { value: "95%", label: "Success Rate", icon: <FaTrophy />, color: "text-yellow-500" },
    { value: "50K+", label: "Active Learners", icon: <FaUsers />, color: "text-blue-500" },
    { value: "∞", label: "Learning Potential", icon: <FaRocket />, color: "text-purple-500" }
  ], []);

  const testimonials = useMemo(() => [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      content: "Learnatics transformed my career. The adaptive learning kept me engaged and the practical projects built my portfolio.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      content: "The analytics helped me identify my weak areas. Within months, I was leading complex projects confidently.",
      rating: 5,
      avatar: "MJ"
    },
    {
      name: "Elena Rodriguez",
      role: "UX Designer",
      content: "Beautiful interface combined with powerful features. Learning HCI concepts has never been this intuitive.",
      rating: 5,
      avatar: "ER"
    }
  ], []);

  const FloatingElement = useCallback(({ children, delay = 0, intensity = 10 }) => (
    <motion.div
      animate={{
        y: [0, -intensity, 0],
        rotate: [0, 2, 0],
        scale: [1, 1.05, 1]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  ), []);

  const MorphingShape = useCallback(({ delay = 0 }) => (
    <motion.div
      className="absolute w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
      animate={{
        scale: [1, 1.5, 1],
        borderRadius: ["50%", "20%", "50%"],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
      style={{
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 80 + 10}%`,
      }}
    />
  ), []);

  const InteractiveCard = useCallback(({ feature, index, isActive }) => (
    <motion.div
      className={`relative p-6 rounded-2xl backdrop-blur-md border transition-all duration-500 ${
        isActive
          ? 'bg-white/20 border-white/30 shadow-2xl scale-105'
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}>
        {feature.icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
      <p className="text-gray-700 mb-3">{feature.description}</p>
      <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
        {feature.tech}
      </span>
      {isActive && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <FaCheckCircle className="text-white text-xs" />
        </motion.div>
      )}
    </motion.div>
  ), []);

  return (
    <div className="App">
      {/* Navigation */}
      <motion.nav
        className="navbar fixed top-0 w-full z-50 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-white font-bold text-xl relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <span className="relative z-10">L</span>
              </div>
              <span className="text-white font-bold text-2xl">Learnatics</span>
            </motion.div>
            <div className="hidden md:flex space-x-8">
              {['features', 'courses', 'testimonials', 'about'].map((item, index) => (
                item === 'courses' ? (
                  <motion.div
                    key={item}
                    className="text-white hover:text-blue-200 transition relative group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link to="/courses" className="block">
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                      <motion.div
                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 group-hover:w-full"
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.a
                    key={item}
                    href={`#${item}`}
                    className="text-white hover:text-blue-200 transition relative group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                    <motion.div
                      className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 group-hover:w-full"
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                )
              ))}
            </div>
            <div className="flex space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-lg border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all duration-300 hover:shadow-lg"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Link
                  to="/signup"
                  className="px-6 py-2 rounded-lg bg-secondary text-white hover:bg-blue-600 transition-all duration-300 hover:shadow-lg relative overflow-hidden group"
                >
                  <span className="relative z-10">Sign Up</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section pt-32 pb-20 relative min-h-screen flex items-center overflow-hidden">
        {/* Advanced Animated Background */}
        <div className="hero-background absolute inset-0">
          {/* Morphing Shapes */}
          {[...Array(5)].map((_, i) => (
            <MorphingShape key={i} delay={i * 1.5} />
          ))}

          {/* Interactive Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Advanced Particle System */}
        <Suspense fallback={<div />}>
          <ParticleSystem mousePosition={mousePosition} />
        </Suspense>

        {/* Interactive Mouse Follower */}
        <motion.div
          className="fixed w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full pointer-events-none z-50 blur-sm"
          animate={{
            x: mousePosition.x * 10 - 20,
            y: mousePosition.y * 10 - 20,
            scale: [1, 1.5, 1],
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        />

        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10"
          style={{ y: springY, opacity: springOpacity, scale }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Enhanced Left Content */}
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Master Skills with{' '}
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 relative"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  Learnatics
                  <motion.div
                    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  />
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-xl text-blue-100 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Experience revolutionary adaptive learning that adapts to your unique style.
                Master HCI, Software Engineering, Data Visualization, and Project Management with
                intelligent guidance and real-time feedback.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Link
                    to="/signup"
                    className="btn-primary px-8 py-4 rounded-lg text-white font-semibold text-center inline-flex items-center space-x-2 hover:shadow-2xl transform transition"
                  >
                    <FaRocket className="group-hover:rotate-12 transition-transform" />
                    <span>Get Started Free</span>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="px-8 py-4 rounded-lg border-2 border-white text-white font-semibold text-center inline-flex items-center space-x-2 transition hover:bg-white hover:text-blue-600 hover:shadow-2xl transform hover:scale-105"
                  >
                    <FaPlay />
                    <span>I Have an Account</span>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-12 flex gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-white text-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="text-3xl font-bold mb-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.1, type: "spring" }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-blue-200 text-sm flex items-center justify-center space-x-1">
                      {stat.icon}
                      <span>{stat.label}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              <FloatingElement delay={0}>
                <div className="bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-400 rounded-3xl p-1 shadow-2xl relative">
                  <div className="bg-white rounded-3xl p-8 relative overflow-hidden">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 transform rotate-12 scale-150"></div>
                    </div>

                    <div className="relative z-10">
                      <motion.div
                        className="flex items-center space-x-2 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <FaLightbulb className="text-yellow-500 text-2xl" />
                        <span className="text-gray-700 font-semibold">Smart Learning</span>
                      </motion.div>

                      <div className="space-y-4 mb-6">
                        {[
                          { label: "Adaptive Learning", progress: 85, color: "bg-green-500" },
                          { label: "Skill Assessment", progress: 92, color: "bg-blue-500" },
                          { label: "Progress Tracking", progress: 78, color: "bg-purple-500" }
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            className="flex items-center space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + i * 0.1 }}
                          >
                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-700 font-medium">{item.label}</span>
                                <span className="text-gray-500">{item.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                  className={`h-2 rounded-full ${item.color}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.progress}%` }}
                                  transition={{ delay: 1.5 + i * 0.1, duration: 1 }}
                                ></motion.div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <motion.div
                        className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-secondary relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
                        <motion.div
                          className="flex items-center space-x-2 mb-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.8 }}
                        >
                          <FaTrophy className="text-yellow-500" />
                          <p className="text-gray-700 font-semibold">Your Progress</p>
                        </motion.div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <motion.div
                            className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "75%" }}
                            transition={{ delay: 2, duration: 1.5 }}
                          ></motion.div>
                        </div>
                        <motion.p
                          className="text-sm text-gray-600"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.2 }}
                        >
                          Module 3 of 4 - 75% Complete
                        </motion.p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </FloatingElement>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-primary rounded-full text-sm font-medium">
                💬 Success Stories
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              What Our Learners Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful learners who transformed their careers with Learnatics
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden group"
                variants={fadeInUp}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-75 transition-opacity" />

                <div className="relative z-10">
                  {/* Rating Stars */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * i, type: "spring" }}
                      >
                        <FaStar className="text-yellow-400 mr-1" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 to-purple-50"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-primary rounded-full text-sm font-medium">
                ✨ Powerful Features
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Why Choose Learnatics?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A comprehensive learning platform designed for success with cutting-edge technology
            </p>
          </motion.div>

          <motion.div
            ref={featuresRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <InteractiveCard
                key={index}
                feature={feature}
                index={index}
                isActive={index === currentFeature}
              />
            ))}
          </motion.div>

          {/* Feature Navigation */}
          <motion.div
            className="flex justify-center mt-12 space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {features.map((_, index) => (
              <motion.button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentFeature
                    ? 'bg-white shadow-lg scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                onClick={() => setCurrentFeature(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-blue-800 to-purple-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium border border-white/30">
                🎯 Interactive Experience
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              See Learnatics in Action
            </h2>
            <p className="text-xl text-blue-100">
              Experience our adaptive learning environment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Interactive Demo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Suspense fallback={
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 animate-pulse">
                  <div className="h-64 bg-white/20 rounded-lg"></div>
                </div>
              }>
                <InteractiveDemo />
              </Suspense>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {[
                {
                  step: "01",
                  title: "AI Assessment",
                  desc: "Advanced algorithms analyze your current skill level and learning style",
                  icon: <FaBrain className="text-yellow-400" />
                },
                {
                  step: "02",
                  title: "Personalized Learning",
                  desc: "Custom curriculum adapts in real-time to your progress and preferences",
                  icon: <FaLightbulb className="text-blue-400" />
                },
                {
                  step: "03",
                  title: "Interactive Practice",
                  desc: "Hands-on projects and coding challenges reinforce your learning",
                  icon: <FaCode className="text-green-400" />
                },
                {
                  step: "04",
                  title: "Career Growth",
                  desc: "Track achievements and unlock new opportunities in your field",
                  icon: <FaRocket className="text-purple-400" />
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-blue-100 text-sm">{item.desc}</p>
                  </div>
                  <div className="text-blue-300 text-xl">
                    {item.icon}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
