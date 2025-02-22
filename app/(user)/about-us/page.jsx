"use client";
import { motion } from "framer-motion";

// Icons
import { ImLocation } from "react-icons/im";
import { LuMail } from "react-icons/lu";
import { FaPhone } from "react-icons/fa6";

import useGetAbout from "@/hooks/api/aboutme/useGetAbout";
import CircularLoader from "@/components/ui/circular-loader";


export default function AboutMe() {
  const { data, error, isLoading } = useGetAbout();
  

  if(isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularLoader className='text-orange-500' />
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500">Something went wrong</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-transparent hover:border-gradient"
        
      >
        <div className="p-8 sm:p-12">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl font-extrabold text-gray-900 mb-6 text-center"
          >
            درباره ما
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg text-gray-600 mb-8 text-justify leading-relaxed"
          >
            {data?.content.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
              <ImLocation className="w-6 h-6 text-orange-500" />
              <p className="text-gray-700 mx-2 text-lg">{data?.content.contact.address}</p>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
              <FaPhone className="w-6 h-6 text-orange-500" />
              <p className="text-gray-700 mx-2 text-lg">{data?.content.contact.phone}</p>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
              <LuMail className="w-6 h-6 text-orange-500" />
              <p className="text-gray-700 mx-2 text-lg">{data?.content.contact.email}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}