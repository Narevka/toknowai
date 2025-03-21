
import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-12 border-t border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div>
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-lg font-semibold mb-4 text-gray-700"
          >
            Kontakt
          </motion.h4>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center mb-2"
          >
            <MapPin className="mr-2 h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Narewka, ul. Hajnowska 1A, 17-220 Narewka</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center mb-2"
          >
            <Mail className="mr-2 h-4 w-4 text-gray-500" />
            <a href="mailto:info@toknowai.pl" className="text-gray-600 hover:text-magenta transition-colors">
              info@toknowai.pl
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center"
          >
            <Phone className="mr-2 h-4 w-4 text-gray-500" />
            <span className="text-gray-600">606 340 002</span>
          </motion.div>
        </div>

        {/* Quick Links */}
        <div>
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg font-semibold mb-4 text-gray-700"
          >
            Szybkie linki
          </motion.h4>
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="list-none space-y-2"
          >
            <li>
              <Link to="/" className="text-gray-600 hover:text-magenta transition-colors">
                Strona główna
              </Link>
            </li>
            <li>
              <Link to="/offer" className="text-gray-600 hover:text-magenta transition-colors">
                Oferta
              </Link>
            </li>
            <li>
              <Link to="/my-courses" className="text-gray-600 hover:text-magenta transition-colors">
                Moje kursy
              </Link>
            </li>
             <li>
              <Link to="/terms" className="text-gray-600 hover:text-magenta transition-colors">
                Regulamin
              </Link>
            </li>
          </motion.ul>
        </div>

        {/* Newsletter Signup (Example) */}
        <div>
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-lg font-semibold mb-4 text-gray-700"
          >
            Zapisz się do newslettera
          </motion.h4>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-gray-600 mb-4"
          >
            Otrzymuj informacje o nowych kursach i promocjach.
          </motion.p>
          {/* You can add a newsletter form here */}
        </div>
      </div>

      {/* Copyright Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center mt-8"
      >
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} ToKnowAI. Wszelkie prawa zastrzeżone.
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;
