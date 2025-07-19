import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const linkVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className={`fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-300 ${
          isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-white"
          >
            <img
              className="md:block hidden w-40 h-25 mix-blend-screen"
              src="https://preview.redd.it/3d-rendered-the-cyberpunk-logo-using-blender-v0-khopj82wqee91.png?width=1080&crop=smart&auto=webp&s=0e62e74ba8b5ef6191228e855079491cfa56f57b"
              alt=""
            />
          </motion.div>

          <div className="flex gap-8">
            {["Home", "About", "Projects", "Contact"].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                variants={linkVariants}
                whileHover="hover"
                className="text-white hover:text-blue-400 transition-colors"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
