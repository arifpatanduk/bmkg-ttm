import Image from "next/image";
import { useState, useEffect } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full transition-colors duration-300 z-50 ${
        isScrolled ? "bg-white/30 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo.png" // Ensure logo is in public folder
            alt="Logo"
            width={40}
            height={40}
            className="mr-3"
          />
          {/* Header Text */}
          <div>
            <h1 className="text-xl font-bold">
              Badan Meteorologi Klimatologi dan Geofisika
            </h1>
            <p className="text-sm text-gray-500">
              Stasiun Geofisika Kelas III Sorong
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
