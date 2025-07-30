'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Wallet,
  Clock,
  CheckCircle,
  ArrowRight,
  FileText,
  Calendar,
  DollarSign,
  Shield,
  Zap,
  User,
  Briefcase,
  Star,
  Sparkles,
  TrendingUp,
  Lock,
  Unlock,
  Send,
  Eye,
  Target,
} from "lucide-react";

const EscrowExperience = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userRole, setUserRole] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [balance, setBalance] = useState(0);
  const [completedDeals, setCompletedDeals] = useState(78);
  const [currentDate, setCurrentDate] = useState(7);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const steps = [
    "intro",
    "roleSelection",
    "dashboard",
    "smartContract",
    "timelapse",
    "payout",
    "finale",
  ];

  // Epic mouse tracking for particle effects
  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number }) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (currentStep === 0 && isPlaying) {
      const timer = setTimeout(() => setCurrentStep(1), 10000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isPlaying]);

  const startExperience = () => {
    setIsPlaying(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Floating particles component
  const FloatingParticles = ({ count = 50, color = "#3B82F6" }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      // This runs only on the client, after the component mounts
      setIsClient(true);
    }, []);

    // Don't render anything on the server
    if (!isClient) {
      return null;
    }

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-60"
            style={{ backgroundColor: color }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  // Matrix-style digital rain
  const MatrixRain = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      // This runs only on the client, after the component mounts
      setIsClient(true);
    }, []);

    // Don't render anything on the server
    if (!isClient) {
      return null;
    }

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-400 text-xs font-mono opacity-20"
            style={{ left: `${i * 5}%` }}
            initial={{ y: -100 }}
            animate={{ y: window.innerHeight + 100 }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear",
            }}
          >
            {Array.from({ length: 20 }, () =>
              Math.random() > 0.5 ? "1" : "0"
            ).join("")}
          </motion.div>
        ))}
      </div>
    );
  };

  // Epic glitch text effect
  interface GlitchTextProps {
    children: React.ReactNode;
    className?: string;
  }

  const GlitchText: React.FC<GlitchTextProps> = ({
    children,
    className = "",
  }) => (
    <motion.div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, -2, 2, 0],
          filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0 text-red-500 mix-blend-multiply"
        animate={{
          x: [0, 2, -2, 0],
          opacity: [0, 0.7, 0],
        }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
        }}
      >
        {children}
      </motion.div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );

  // Holographic card effect
  interface HolographicCardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }

  const HolographicCard: React.FC<HolographicCardProps> = ({
    children,
    className = "",
    ...props
  }) => (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.02 }}
      style={{
        background: `linear-gradient(135deg, 
          rgba(255,255,255,0.1) 0%, 
          rgba(255,255,255,0.05) 50%, 
          rgba(255,255,255,0.1) 100%)`,
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.2)",
      }}
      {...props}
    >
      <motion.div
        className="absolute inset-0 opacity-0"
        animate={{
          background: [
            "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
            "linear-gradient(135deg, transparent, rgba(255,255,255,0.1), transparent)",
            "linear-gradient(225deg, transparent, rgba(255,255,255,0.1), transparent)",
            "linear-gradient(315deg, transparent, rgba(255,255,255,0.1), transparent)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      {children}
    </motion.div>
  );

  // Cyber grid background
  const CyberGrid = () => (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "50px 50px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );

  // INSANE INTRO STEP
  const IntroStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-screen bg-black overflow-hidden"
      ref={containerRef}
    >
      <CyberGrid />
      <MatrixRain />
      <FloatingParticles count={100} color="#FF0080" />

      {/* Cursor trail effect */}
      <motion.div
        className="absolute w-6 h-6 bg-blue-500 rounded-full mix-blend-screen pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />

      {/* Explosive problem words */}
      <div className="absolute inset-0 flex items-center justify-center">
        {["DELAYED", "DISPUTE", "CONFUSION", "CHAOS"].map((word, i) => (
          <motion.div
            key={word}
            initial={{ opacity: 0, scale: 0, rotateZ: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1.5, 2, 0],
              rotateZ: [0, 180, 360, 720],
              filter: [
                "blur(0px) hue-rotate(0deg)",
                "blur(2px) hue-rotate(90deg)",
                "blur(4px) hue-rotate(180deg)",
                "blur(10px) hue-rotate(360deg)",
              ],
            }}
            transition={{
              duration: 6,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
            className="absolute text-red-500 text-6xl font-black tracking-wider"
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + Math.sin(i) * 30}%`,
              textShadow:
                "0 0 20px #ff0000, 0 0 40px #ff0000, 0 0 60px #ff0000",
            }}
          >
            {word}
          </motion.div>
        ))}
      </div>

      {/* Epic main content with holographic effect */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            delay: 2,
            duration: 1.5,
            type: "spring",
            stiffness: 100,
          }}
          className="relative"
        >
          <GlitchText className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-8">
            THE FUTURE
          </GlitchText>

          <motion.div
            animate={{
              filter: [
                "drop-shadow(0 0 20px #00ffff)",
                "drop-shadow(0 0 40px #ff00ff)",
                "drop-shadow(0 0 20px #00ffff)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <GlitchText className="text-6xl font-black text-white">
              OF PAYMENTS
            </GlitchText>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 4, duration: 1 }}
          className="relative"
        >
          <motion.p
            className="text-2xl text-gray-300 mb-12 max-w-4xl leading-relaxed"
            animate={{
              textShadow: [
                "0 0 10px rgba(255,255,255,0.5)",
                "0 0 20px rgba(59,130,246,0.8)",
                "0 0 10px rgba(255,255,255,0.5)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Tired of payment chaos, missed deadlines, and endless disputes?
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 font-bold">
              See how web3 escrow brings clarity and trust back to your work.
            </span>
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 8, duration: 1, type: "spring", stiffness: 200 }}
          className="relative"
        >
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity },
            }}
            className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              boxShadow:
                "0 0 40px #10b981, 0 0 80px #10b981, inset 0 0 20px rgba(255,255,255,0.3)",
            }}
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Pulsing rings around checkmark */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 border-2 border-green-400 rounded-full"
              initial={{ scale: 1, opacity: 1 }}
              animate={{
                scale: [1, 2.5, 4],
                opacity: [1, 0.5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: ring * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Scanning line effect */}
      <motion.div
        className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        initial={{ top: "-4px" }}
        animate={{ top: "100vh" }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          boxShadow: "0 0 20px #00ffff, 0 0 40px #00ffff",
        }}
      />
    </motion.div>
  );

  // MIND-BLOWING ROLE SELECTION
  const RoleSelectionStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen bg-black flex items-center justify-center relative overflow-hidden"
    >
      <CyberGrid />
      <FloatingParticles count={80} color="#8B5CF6" />

      <div className="text-center relative z-10">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring" }}
        >
          <GlitchText className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-16">
            CHOOSE YOUR DESTINY
          </GlitchText>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-12 justify-center">
          {[
            {
              role: "client",
              label: "I'M A CLIENT",
              icon: Briefcase,
              gradient: "from-blue-500 via-cyan-500 to-teal-500",
              shadow: "blue",
            },
            {
              role: "freelancer",
              label: "I'M A FREELANCER",
              icon: User,
              gradient: "from-purple-500 via-pink-500 to-red-500",
              shadow: "purple",
            },
          ].map((option, index) => (
            <motion.div
              key={option.role}
              initial={{
                x: index === 0 ? -300 : 300,
                opacity: 0,
                rotateY: index === 0 ? -90 : 90,
              }}
              animate={{
                x: 0,
                opacity: 1,
                rotateY: 0,
              }}
              transition={{
                delay: 0.5 + index * 0.3,
                duration: 1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.1,
                rotateY: 10,
                z: 50,
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setUserRole(option.role);
                setBalance(1500);

                // Epic explosion effect
                const explosions = Array.from({ length: 30 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    initial={{
                      x: 0,
                      y: 0,
                      scale: 0,
                      opacity: 1,
                    }}
                    animate={{
                      x: (Math.random() - 0.5) * 400,
                      y: (Math.random() - 0.5) * 400,
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeOut",
                    }}
                  />
                ));

                setTimeout(nextStep, 2000);
              }}
              className="group cursor-pointer perspective-1000"
            >
              <HolographicCard
                className={`p-12 rounded-3xl bg-gradient-to-br ${option.gradient} relative overflow-hidden transform-gpu`}
                style={{
                  boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 60px rgba(${
                    option.shadow === "blue" ? "59,130,246" : "168,85,247"
                  },0.4)`,
                }}
              >
                {/* Animated background pattern */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, white 2px, transparent 2px)",
                    backgroundSize: "30px 30px",
                  }}
                />

                <motion.div
                  animate={{
                    rotateZ: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotateZ: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity },
                  }}
                  className="relative z-10"
                >
                  <option.icon className="w-20 h-20 text-white mx-auto mb-6 drop-shadow-2xl" />
                </motion.div>

                <motion.h3
                  className="text-3xl font-black text-white tracking-wider"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,1)",
                      "0 0 10px rgba(255,255,255,0.8)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {option.label}
                </motion.h3>

                {/* Hover particles */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </motion.div>
              </HolographicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // CYBERPUNK DASHBOARD
  const DashboardStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black text-white p-8 relative overflow-hidden"
    >
      <CyberGrid />
      <MatrixRain />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <GlitchText className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
            WELCOME BACK, VICKY!
          </GlitchText>
          <motion.p
            className="text-gray-400 text-xl"
            animate={{
              color: ["#9CA3AF", "#00FFFF", "#9CA3AF"],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Your Paycasso Command Center
          </motion.p>
        </motion.div>

        {/* Insane Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              title: "TOTAL BALANCE",
              value: balance,
              prefix: "$",
              suffix: " USDC",
              icon: Wallet,
              color: "from-green-400 to-emerald-600",
              delay: 0.1,
            },
            {
              title: "PENDING ESCROW",
              value: 12,
              icon: Clock,
              color: "from-yellow-400 to-orange-500",
              delay: 0.2,
            },
            {
              title: "COMPLETED DEALS",
              value: completedDeals,
              icon: TrendingUp,
              color: "from-purple-400 to-pink-500",
              delay: 0.3,
            },
            {
              title: "DISPUTES",
              value: 2,
              icon: Shield,
              color: "from-red-400 to-red-600",
              delay: 0.4,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ y: 100, opacity: 0, rotateX: -90 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{
                delay: stat.delay,
                duration: 0.8,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                z: 20,
              }}
              className="group perspective-1000"
            >
              <HolographicCard className="p-6 rounded-2xl bg-gray-900/50 border border-gray-700 relative overflow-hidden">
                {/* Animated background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10`}
                  transition={{ duration: 0.3 }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 text-sm font-bold tracking-wider">
                      {stat.title}
                    </h3>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <stat.icon
                        className={`w-6 h-6 bg-gradient-to-r ${stat.color} text-transparent bg-clip-text`}
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: stat.delay + 0.5,
                      duration: 0.5,
                      type: "spring",
                    }}
                    className={`text-4xl font-black bg-gradient-to-r ${stat.color} text-transparent bg-clip-text`}
                  >
                    <CountUp
                      end={stat.value}
                      prefix={stat.prefix || ""}
                      suffix={stat.suffix || ""}
                    />
                  </motion.div>
                </div>

                {/* Holographic scanlines */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  animate={{
                    backgroundPosition: ["0% 0%", "0% 100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
                    backgroundSize: "100% 20px",
                  }}
                />
              </HolographicCard>
            </motion.div>
          ))}
        </div>

        {/* EXPLOSIVE NEW ESCROW BUTTON */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1, duration: 1, type: "spring", stiffness: 100 }}
          className="mb-12 flex justify-center relative"
        >
          <motion.button
            whileHover={{
              scale: 1.1,
              rotateY: 10,
            }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                "0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(59, 130, 246, 0.4)",
                "0 0 60px rgba(168, 85, 247, 0.8), 0 0 120px rgba(168, 85, 247, 0.6)",
                "0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(59, 130, 246, 0.4)",
              ],
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity },
            }}
            onClick={nextStep}
            className="relative px-16 py-6 rounded-2xl text-2xl font-black text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden group transform-gpu"
          >
            {/* Button background animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <div className="relative z-10 flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-8 h-8" />
              </motion.div>

              <span className="tracking-wider">NEW ESCROW</span>

              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight className="w-8 h-8" />
              </motion.div>
            </div>

            {/* Particle explosion on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: (Math.random() - 0.5) * 100,
                    y: (Math.random() - 0.5) * 100,
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: Math.random() * 1,
                  }}
                />
              ))}
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Floating Holographic Calendar */}
        <motion.div
          initial={{ x: 400, opacity: 0, rotateY: 90 }}
          animate={{ x: 0, opacity: 1, rotateY: 0 }}
          transition={{ delay: 1.5, duration: 1, type: "spring" }}
          className="fixed top-8 right-8 hidden lg:block perspective-1000"
        >
          <HolographicCard className="p-6 rounded-2xl bg-gray-900/80 border border-cyan-500/30 w-80">
            <motion.h3
              className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6"
              animate={{
                textShadow: [
                  "0 0 10px #00ffff",
                  "0 0 20px #00ffff",
                  "0 0 10px #00ffff",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              JANUARY 2025
            </motion.h3>

            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div
                  key={day}
                  className="text-gray-400 font-bold py-2 text-cyan-400"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <motion.div
                  key={day}
                  className={`py-2 rounded-lg cursor-pointer font-bold ${
                    day === currentDate
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                      : day === 18
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-cyan-400"
                  }`}
                  whileHover={{ scale: 1.1, z: 10 }}
                  animate={
                    day === currentDate
                      ? {
                          boxShadow: [
                            "0 0 20px rgba(59, 130, 246, 0.8)",
                            "0 0 40px rgba(59, 130, 246, 1)",
                            "0 0 20px rgba(59, 130, 246, 0.8)",
                          ],
                        }
                      : {}
                  }
                  transition={{
                    boxShadow: { duration: 1.5, repeat: Infinity },
                    scale: { duration: 0.2 },
                  }}
                >
                  {day}
                </motion.div>
              ))}
            </div>
          </HolographicCard>
        </motion.div>
      </div>
    </motion.div>
  );

  // MIND-MELTING SMART CONTRACT ANIMATION
  const SmartContractStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen bg-black flex items-center justify-center relative overflow-hidden"
    >
      <FloatingParticles count={150} color="#8B5CF6" />
      <CyberGrid />

      <div className="text-center max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <GlitchText className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-16">
            DEPLOYING SMART CONTRACT
          </GlitchText>
        </motion.div>

        {/* Epic Three Node System */}
        <div className="relative flex flex-col md:flex-row justify-between items-center mb-12 gap-8 md:gap-0">
          {/* Client Node */}
          <motion.div
            initial={{ scale: 0, x: -200, rotateY: -90 }}
            animate={{ scale: 1, x: 0, rotateY: 0 }}
            transition={{
              delay: 0.5,
              duration: 1,
              type: "spring",
              stiffness: 100,
            }}
            className="flex flex-col items-center group"
          >
            <motion.div
              className="relative w-32 h-32 rounded-full flex items-center justify-center mb-6 overflow-hidden"
              animate={{
                background: [
                  "linear-gradient(45deg, #3B82F6, #1D4ED8)",
                  "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                  "linear-gradient(225deg, #3B82F6, #1D4ED8)",
                  "linear-gradient(315deg, #1D4ED8, #3B82F6)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                boxShadow:
                  "0 0 60px rgba(59, 130, 246, 0.8), inset 0 0 20px rgba(255,255,255,0.2)",
              }}
            >
              <User className="w-16 h-16 text-white relative z-10" />

              {/* Rotating rings */}
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute inset-0 border-2 border-blue-400/50 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3 + ring,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    transform: `scale(${1 + ring * 0.2})`,
                  }}
                />
              ))}
            </motion.div>
            <motion.p
              className="text-white font-black text-xl tracking-wider"
              animate={{
                textShadow: [
                  "0 0 10px #3B82F6",
                  "0 0 20px #3B82F6",
                  "0 0 10px #3B82F6",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              YOU (CLIENT)
            </motion.p>
          </motion.div>

          {/* CONTRACT NODE - The Star of the Show */}
          <motion.div
            initial={{ scale: 0, y: -100 }}
            animate={{ scale: 1, y: 0 }}
            transition={{
              delay: 1,
              duration: 1.5,
              type: "spring",
              stiffness: 80,
            }}
            className="flex flex-col items-center relative"
          >
            <motion.div
              className="relative w-48 h-48 rounded-full flex items-center justify-center mb-8 overflow-hidden"
              animate={{
                background: [
                  "radial-gradient(circle, #8B5CF6, #7C3AED)",
                  "radial-gradient(circle, #7C3AED, #6D28D9)",
                  "radial-gradient(circle, #6D28D9, #8B5CF6)",
                ],
                scale: [1, 1.1, 1],
                rotate: [0, 360],
              }}
              transition={{
                background: { duration: 3, repeat: Infinity },
                scale: { duration: 2, repeat: Infinity },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              }}
              style={{
                boxShadow:
                  "0 0 100px rgba(139, 92, 246, 1), 0 0 200px rgba(139, 92, 246, 0.5), inset 0 0 50px rgba(255,255,255,0.1)",
              }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="relative z-10"
              >
                <Shield className="w-24 h-24 text-white" />
              </motion.div>

              {/* Energy waves */}
              {[1, 2, 3, 4, 5].map((wave) => (
                <motion.div
                  key={wave}
                  className="absolute inset-0 border-2 border-purple-400/30 rounded-full"
                  animate={{
                    scale: [1, 3],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: wave * 0.5,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Inner spinning elements */}
              <motion.div
                className="absolute inset-4 border-4 border-dashed border-white/30 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            <motion.p
              className="text-white font-black text-2xl tracking-wider mb-4"
              animate={{
                textShadow: [
                  "0 0 10px #8B5CF6",
                  "0 0 30px #8B5CF6",
                  "0 0 10px #8B5CF6",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              PAYCASSO CONTRACT
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, duration: 0.8, type: "spring" }}
              className="text-center"
            >
              <motion.p
                className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500"
                animate={{
                  scale: [1, 1.1, 1],
                  filter: [
                    "drop-shadow(0 0 10px #10b981)",
                    "drop-shadow(0 0 20px #10b981)",
                    "drop-shadow(0 0 10px #10b981)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                $1,500 USDC SECURED
              </motion.p>

              {/* Money flow animation */}
              <motion.div
                className="flex justify-center mt-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <DollarSign className="w-8 h-8 text-green-400" />
                <DollarSign className="w-8 h-8 text-green-400 mx-2" />
                <DollarSign className="w-8 h-8 text-green-400" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Freelancer Node */}
          <motion.div
            initial={{ scale: 0, x: 200, rotateY: 90 }}
            animate={{ scale: 1, x: 0, rotateY: 0 }}
            transition={{
              delay: 1.5,
              duration: 1,
              type: "spring",
              stiffness: 100,
            }}
            className="flex flex-col items-center"
          >
            <motion.div
              className="relative w-32 h-32 rounded-full flex items-center justify-center mb-6 overflow-hidden"
              animate={{
                background: [
                  "linear-gradient(45deg, #10B981, #059669)",
                  "linear-gradient(135deg, #059669, #10B981)",
                  "linear-gradient(225deg, #10B981, #059669)",
                  "linear-gradient(315deg, #059669, #10B981)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                boxShadow:
                  "0 0 60px rgba(16, 185, 129, 0.8), inset 0 0 20px rgba(255,255,255,0.2)",
              }}
            >
              <Briefcase className="w-16 h-16 text-white relative z-10" />

              {/* Approval checkmark animation */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
                transition={{ delay: 3.5, duration: 1, type: "spring" }}
                className="absolute -top-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
                style={{
                  boxShadow: "0 0 20px #10b981",
                }}
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
            <motion.p
              className="text-white font-black text-xl tracking-wider"
              animate={{
                textShadow: [
                  "0 0 10px #10B981",
                  "0 0 20px #10B981",
                  "0 0 10px #10B981",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              FREELANCER
            </motion.p>
          </motion.div>

          {/* Epic Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Client to Contract */}
            <motion.path
              d="M 150 150 Q 300 100 450 150"
              stroke="url(#gradient1)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="10,5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 2.5, duration: 1.5, ease: "easeInOut" }}
            />

            {/* Contract to Freelancer */}
            <motion.path
              d="M 550 150 Q 700 100 850 150"
              stroke="url(#gradient2)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="10,5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 3.5, duration: 1.5, ease: "easeInOut" }}
            />

            {/* Gradients for the lines */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>

            {/* Energy particles along the lines */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.circle
                key={i}
                r="3"
                fill="#fff"
                initial={{ opacity: 0 }}
                animate={{
                  cx: [150, 450],
                  cy: [150, 150],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 2.5 + i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </svg>
        </div>

        {/* Success Explosion */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 5, duration: 1, type: "spring" }}
          onAnimationComplete={() => setTimeout(nextStep, 2000)}
          className="text-center relative"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              scale: { duration: 2, repeat: Infinity },
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            }}
            className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              boxShadow: "0 0 60px #10b981, 0 0 120px #10b981",
            }}
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          <motion.p
            className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500"
            animate={{
              textShadow: [
                "0 0 20px #10b981",
                "0 0 40px #10b981",
                "0 0 20px #10b981",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            CONTRACT DEPLOYED SUCCESSFULLY!
          </motion.p>

          {/* Success particles */}
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full"
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: (Math.random() - 0.5) * 600,
                y: (Math.random() - 0.5) * 400,
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 1,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );

  // INSANE TIMELAPSE ANIMATION
  const TimelapseStep = () => {
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentDate((prev) => {
          if (prev >= 18) {
            clearInterval(interval);
            setTimeout(nextStep, 3000);
            return 18;
          }
          return prev + 1;
        });
      }, 150);

      return () => clearInterval(interval);
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen bg-black flex items-center justify-center relative overflow-hidden"
      >
        <CyberGrid />
        <FloatingParticles count={100} color="#F59E0B" />

        <div className="text-center relative z-10">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <GlitchText className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-16">
              CONTRACT ACTIVE!
            </GlitchText>
          </motion.div>

          {/* Massive Calendar with Extreme Animation */}
          <motion.div
            initial={{ scale: 0, rotateX: -90 }}
            animate={{ scale: 1, rotateX: 0 }}
            transition={{
              delay: 0.5,
              duration: 1,
              type: "spring",
              stiffness: 100,
            }}
            className="perspective-1000 mb-12"
          >
            <HolographicCard className="p-12 rounded-3xl bg-gray-900/80 border-2 border-yellow-500/50 max-w-2xl mx-auto">
              <motion.h3
                className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-8"
                animate={{
                  textShadow: [
                    "0 0 20px #F59E0B",
                    "0 0 40px #F59E0B",
                    "0 0 20px #F59E0B",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                JANUARY 2025
              </motion.h3>

              <div className="grid grid-cols-7 gap-4 text-center">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <div
                    key={day}
                    className="text-yellow-400 font-black py-3 text-2xl"
                  >
                    {day}
                  </div>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <motion.div
                    key={day}
                    className={`py-4 px-2 rounded-xl text-xl font-black cursor-pointer relative overflow-hidden ${
                      day === currentDate
                        ? "text-white"
                        : day === 18
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                    animate={{
                      backgroundColor:
                        day === currentDate
                          ? "#3B82F6"
                          : day === 18
                          ? "#8B5CF6"
                          : "#374151",
                      scale: day === currentDate ? [1, 1.3, 1] : 1,
                      boxShadow:
                        day === currentDate
                          ? [
                              "0 0 20px rgba(59, 130, 246, 0.8)",
                              "0 0 40px rgba(59, 130, 246, 1)",
                              "0 0 20px rgba(59, 130, 246, 0.8)",
                            ]
                          : day === 18
                          ? "0 0 30px rgba(139, 92, 246, 0.8)"
                          : "0 0 0px transparent",
                    }}
                    transition={{
                      backgroundColor: { duration: 0.3 },
                      scale: {
                        duration: 0.5,
                        repeat: day === currentDate ? Infinity : 0,
                      },
                      boxShadow: { duration: 1, repeat: Infinity },
                    }}
                  >
                    {day}

                    {/* Lightning effect for current date */}
                    {day === currentDate && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </HolographicCard>
          </motion.div>

          {/* Epic Draft Ready Animation */}
          {currentDate >= 18 && (
            <motion.div
              initial={{ scale: 0, y: 100, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="text-center relative"
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity },
                }}
                className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8"
                style={{
                  boxShadow: "0 0 80px #F59E0B, 0 0 160px #F59E0B",
                }}
              >
                <FileText className="w-16 h-16 text-white" />
              </motion.div>

              <motion.p
                className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
                animate={{
                  textShadow: [
                    "0 0 20px #F59E0B",
                    "0 0 40px #F59E0B",
                    "0 0 20px #F59E0B",
                  ],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                DRAFT 1 READY FOR REVIEW!
              </motion.p>

              {/* Celebration particles */}
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 1,
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 800,
                    y: (Math.random() - 0.5) * 600,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: Math.random() * 2,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  // EXPLOSIVE PAYOUT ANIMATION
  const PayoutStep = () => {
    useEffect(() => {
      const timer = setTimeout(() => {
        setCompletedDeals(79);
        setBalance((prev) => prev - 500);
      }, 3000);

      const finalTimer = setTimeout(nextStep, 6000);

      return () => {
        clearTimeout(timer);
        clearTimeout(finalTimer);
      };
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen bg-black flex items-center justify-center relative overflow-hidden"
      >
        <FloatingParticles count={200} color="#10B981" />
        <CyberGrid />

        <div className="text-center max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <GlitchText className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 mb-12">
              WORK APPROVED!
            </GlitchText>
          </motion.div>

          {/* Epic Work Preview Card */}
          <motion.div
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{
              delay: 0.5,
              duration: 1,
              type: "spring",
              stiffness: 100,
            }}
            className="mb-12"
          >
            <HolographicCard className="p-12 rounded-3xl bg-gray-900/80 border-2 border-green-500/50 relative overflow-hidden">
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))",
                    "linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(16, 185, 129, 0.1))",
                    "linear-gradient(225deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))",
                    "linear-gradient(315deg, rgba(5, 150, 105, 0.1), rgba(16, 185, 129, 0.1))",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative z-10">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity },
                  }}
                  className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8"
                  style={{
                    boxShadow:
                      "0 0 60px #10b981, inset 0 0 20px rgba(255,255,255,0.2)",
                  }}
                >
                  <FileText className="w-16 h-16 text-white" />
                </motion.div>

                <motion.h3
                  className="text-4xl font-black text-white mb-8"
                  animate={{
                    textShadow: [
                      "0 0 10px #10b981",
                      "0 0 30px #10b981",
                      "0 0 10px #10b981",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Website Design - Draft 1
                </motion.h3>

                <motion.button
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 80px #10b981",
                  }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8, type: "spring" }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 px-12 py-6 rounded-2xl text-2xl font-black text-white flex items-center gap-4 mx-auto relative overflow-hidden group"
                >
                  {/* Button animation background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  <div className="relative z-10 flex items-center gap-4">
                    <CheckCircle className="w-8 h-8" />
                    <span>APPROVE & RELEASE $500 USDC</span>
                  </div>

                  {/* Hover particles */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {Array.from({ length: 20 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: Math.random() * 1,
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.button>
              </div>
            </HolographicCard>
          </motion.div>

          {/* INSANE Payment Stream Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mb-12 relative"
          >
            {/* Payment stream line */}
            <motion.div
              className="relative h-8 bg-gray-800 rounded-full mx-auto max-w-2xl overflow-hidden"
              style={{
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
              }}
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 2.5, duration: 3, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 rounded-full relative overflow-hidden"
                style={{
                  boxShadow: "0 0 40px #10b981",
                }}
              >
                {/* Moving light effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Flowing particles */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full top-1/2 transform -translate-y-1/2"
                    animate={{
                      x: [0, 600],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Stream labels */}
            <div className="flex justify-between mt-4 text-sm font-bold">
              <span className="text-blue-400">CLIENT WALLET</span>
              <span className="text-purple-400">SMART CONTRACT</span>
              <span className="text-green-400">FREELANCER WALLET</span>
            </div>
          </motion.div>

          {/* Epic Success Animation */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 4,
              duration: 1,
              type: "spring",
              stiffness: 150,
            }}
            className="text-center relative"
          >
            {/* Money explosion */}
            <motion.div
              className="relative mb-8"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity },
              }}
            >
              <div
                className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto"
                style={{
                  boxShadow: "0 0 100px #10b981, 0 0 200px #10b981",
                }}
              >
                <DollarSign className="w-16 h-16 text-white" />
              </div>

              {/* Money rain */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 1,
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 400,
                    y: (Math.random() - 0.5) * 300,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    delay: Math.random() * 2,
                    ease: "easeOut",
                  }}
                  className="absolute text-green-400 text-2xl" /* Combined text classes */
                >
                  $
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-4"
              animate={{
                textShadow: [
                  "0 0 20px #10b981",
                  "0 0 40px #10b981",
                  "0 0 20px #10b981",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              PAYMENT RELEASED!
            </motion.p>

            <motion.div
              className="flex justify-center gap-8 text-2xl font-bold"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-green-400">
                Completed Deals: <CountUp end={completedDeals} />
              </div>
              <div className="text-blue-400">
                Balance: $<CountUp end={balance} /> USDC
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // MIND-BLOWING FINALE
  const FinaleStep = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen bg-black flex items-center justify-center relative overflow-hidden"
    >
      <CyberGrid />
      <FloatingParticles count={300} color="#FF00FF" />

      {/* Epic background effects */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="text-center relative z-10 max-w-6xl mx-auto px-8">
        {/* Epic title with multiple effects */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.5,
            duration: 1.5,
            type: "spring",
            stiffness: 100,
          }}
          className="mb-12 relative"
        >
          <motion.h1
            className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-4 relative"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              backgroundSize: "300% 300%",
            }}
          >
            <GlitchText>SIMPLE</GlitchText>
          </motion.h1>

          <motion.h1
            className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 mb-4"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            style={{
              backgroundSize: "300% 300%",
            }}
          >
            <GlitchText>SECURE</GlitchText>
          </motion.h1>

          <motion.h1
            className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-blue-500"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              textShadow: [
                "0 0 20px rgba(16, 185, 129, 0.8)",
                "0 0 40px rgba(16, 185, 129, 1)",
                "0 0 20px rgba(16, 185, 129, 0.8)",
              ],
            }}
            transition={{
              backgroundPosition: { duration: 3, repeat: Infinity, delay: 1 },
              textShadow: { duration: 2, repeat: Infinity },
            }}
            style={{
              backgroundSize: "300% 300%",
            }}
          >
            <GlitchText>SOLVED</GlitchText>
          </motion.h1>

          {/* Orbital elements around the text */}
          {[Shield, Lock, Zap, Star].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute"
              animate={{
                rotate: 360,
                x: Math.cos((i * Math.PI) / 2) * 300,
                y: Math.sin((i * Math.PI) / 2) * 200,
              }}
              transition={{
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                top: "50%",
                left: "50%",
              }}
            >
              <Icon className="w-12 h-12 text-purple-400 opacity-60" />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-3xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed"
          style={{
            textShadow: "0 0 20px rgba(255,255,255,0.3)",
          }}
        >
          Experience the future of freelance payments with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-black">
            Paycasso&apos;s web3 escrow solution
          </span>
        </motion.p>

        {/* Epic CTA Button */}
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 2.5,
            duration: 1,
            type: "spring",
            stiffness: 150,
          }}
          className="mb-12"
        >
          <motion.button
            whileHover={{
              scale: 1.15,
              rotateY: 10,
              boxShadow: "0 0 100px rgba(139, 92, 246, 0.8)",
            }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                "0 20px 60px rgba(139, 92, 246, 0.4)",
                "0 20px 80px rgba(59, 130, 246, 0.6)",
                "0 20px 60px rgba(139, 92, 246, 0.4)",
              ],
            }}
            transition={{
              boxShadow: { duration: 3, repeat: Infinity },
            }}
            className="relative px-16 py-8 rounded-3xl text-3xl font-black text-white bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 overflow-hidden group transform-gpu"
          >
            {/* Multiple animated backgrounds */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <motion.div
              className="absolute inset-0 bg-gradient-to-45 from-transparent via-white to-transparent opacity-20"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <div className="relative z-10 flex items-center gap-6">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity },
                }}
              >
                <Sparkles className="w-12 h-12" />
              </motion.div>

              <span className="tracking-wider">SIGN UP FREE</span>

              <motion.div
                animate={{
                  x: [0, 20, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  x: { duration: 2, repeat: Infinity },
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                }}
              >
                <ArrowRight className="w-12 h-12" />
              </motion.div>
            </div>

            {/* Epic hover particles */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Restart button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
          onClick={() => {
            setCurrentStep(0);
            setUserRole("");
            setBalance(0);
            setCompletedDeals(78);
            setCurrentDate(7);
            setIsPlaying(false);
          }}
          className="text-purple-400 hover:text-white transition-colors duration-300 text-xl font-bold tracking-wider"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ↻
            </motion.div>
            EXPERIENCE AGAIN
          </motion.div>
        </motion.button>
      </div>

      {/* Final screen scanner effect */}
      <motion.div
        className="absolute left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
        animate={{
          top: ["-8px", "100vh"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          boxShadow: "0 0 20px #00ffff, 0 0 40px #00ffff",
        }}
      />
    </motion.div>
  );
  // Count Up Component
  interface CountUpProps {
    end: number;
    prefix?: string;
    suffix?: string;
  }

  const CountUp: React.FC<CountUpProps> = ({
    end,
    prefix = "",
    suffix = "",
  }) => {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
      let startTime: number | null = null;
      const duration: number = 1500;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress: number = Math.min(
          (currentTime - startTime) / duration,
          1
        );
        setCount(Math.floor(progress * end));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [end]);

    return (
      <span>
        {prefix}
        {count}
        {suffix}
      </span>
    );
  };

  if (!isPlaying) {
    return (
      <div className="h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <CyberGrid />
        <FloatingParticles count={100} color="#8B5CF6" />

        <div className="text-center relative z-10">
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, type: "spring", stiffness: 100 }}
          >
            <GlitchText className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 mb-8">
              PAYCASSO
            </GlitchText>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <motion.p
              className="text-3xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed"
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,255,255,0.3)",
                  "0 0 20px rgba(139, 92, 246, 0.6)",
                  "0 0 10px rgba(255,255,255,0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              See how web3 escrow transforms freelance payments in just{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 font-black">
                60 seconds
              </span>
            </motion.p>
          </motion.div>

          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 1.5,
              duration: 1,
              type: "spring",
              stiffness: 150,
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 80px rgba(59, 130, 246, 0.8)",
            }}
            whileTap={{ scale: 0.9 }}
            onClick={startExperience}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-16 py-8 rounded-3xl text-3xl font-black text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 relative overflow-hidden group"
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <div className="relative z-10 flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Target className="w-10 h-10" />
              </motion.div>

              <span className="tracking-wider">START EXPERIENCE</span>

              <motion.div
                animate={{
                  x: [0, 10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Eye className="w-10 h-10" />
              </motion.div>
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        {currentStep === 0 && <IntroStep key="intro" />}
        {currentStep === 1 && <RoleSelectionStep key="role" />}
        {currentStep === 2 && <DashboardStep key="dashboard" />}
        {currentStep === 3 && <SmartContractStep key="contract" />}
        {currentStep === 4 && <TimelapseStep key="timelapse" />}
        {currentStep === 5 && <PayoutStep key="payout" />}
        {currentStep === 6 && <FinaleStep key="finale" />}
      </AnimatePresence>

      {/* Epic Progress Bar */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <HolographicCard className="px-8 py-4 rounded-full bg-black/80 border border-purple-500/30">
          <div className="flex gap-3">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-500 ${
                  index <= currentStep
                    ? "bg-gradient-to-r from-blue-400 to-purple-500"
                    : "bg-white/20"
                }`}
                animate={
                  index <= currentStep
                    ? {
                        boxShadow: [
                          "0 0 10px rgba(59, 130, 246, 0.8)",
                          "0 0 20px rgba(139, 92, 246, 1)",
                          "0 0 10px rgba(59, 130, 246, 0.8)",
                        ],
                        scale: [1, 1.2, 1],
                      }
                    : {}
                }
                transition={{
                  boxShadow: { duration: 2, repeat: Infinity },
                  scale: { duration: 1, repeat: Infinity },
                }}
              />
            ))}
          </div>
        </HolographicCard>
      </motion.div>
    </div>
  );
};

export default EscrowExperience;
