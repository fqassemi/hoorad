"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import usePatchAbout from "@/hooks/api/aboutme/usePatchAbout";
import useGetAbout from "@/hooks/api/aboutme/useGetAbout";
import CircularLoader from "@/components/ui/circular-loader";

export default function AboutUs() {
  const { data, error, isLoading } = useGetAbout();
  const { trigger: updateAbout } = usePatchAbout();

  const [formData, setFormData] = useState({
    description: "",
    contact: {
      email: "",
      phone: "",
      address: "",
    },
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        description: data.description || "",
        contact: {
          email: data.contact?.email || "",
          phone: data.contact?.phone || "",
          address: data.contact?.address || "",
        },
      });
    }
  }, [data]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = "توضیحات الزامی است.";
    }

    if (!formData.contact.email.trim()) {
      newErrors.email = "ایمیل الزامی است.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      newErrors.email = "ایمیل معتبر نیست.";
    }

    if (!formData.contact.phone.trim()) {
      newErrors.phone = "شماره تماس الزامی است.";
    } else if (!/^\d{10,11}$/.test(formData.contact.phone)) {
      newErrors.phone = "شماره تماس معتبر نیست.";
    }

    if (!formData.contact.address.trim()) {
      newErrors.address = "آدرس الزامی است.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      setFormData((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateAbout({ updatedInfo: formData });
    } catch (error) {
      console.error("خطا در به‌روزرسانی اطلاعات:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularLoader className='text-orange-500' />
      </div>
    );
  }

  if (error) {
    return <div>خطا در دریافت اطلاعات!</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f9f9f9] dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            مدیریت درباره من
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <label
                htmlFor="about-description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                توضیحات
              </label>
              <textarea
                id="about-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="توضیحات خود را وارد کنید..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  ایمیل
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                  placeholder="example@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label
                  htmlFor="contact-phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  شماره تماس
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                  placeholder="09123456789"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label
                htmlFor="contact-address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                آدرس
              </label>
              <textarea
                id="contact-address"
                name="contact.address"
                value={formData.contact.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="آدرس خود را وارد کنید..."
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex justify-center"
            >
              <button
                type="submit"
                className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 hover:scale-105 transition-all duration-300"
              >
                ثبت اطلاعات
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}