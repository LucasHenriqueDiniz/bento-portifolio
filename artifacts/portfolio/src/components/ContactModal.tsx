import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { FiSend, FiLoader } from "react-icons/fi";
import { useState, useEffect } from "react";
import { sendDiscordMessage, createContactMessage } from "@/lib/discord";

interface ContactModalProps {
  trigger: React.ReactNode;
}

const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    y: 100,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      duration: 0.4,
    },
  },
};

export function ContactModal({ trigger }: ContactModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Enviar para Discord
      if (import.meta.env.VITE_DISCORD_WEBHOOK_URL) {
        await sendDiscordMessage(
          createContactMessage(formData.email, formData.name, formData.message),
        );
      }

      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: "", email: "", message: "" });
        setSubmitted(false);
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.name.trim() && formData.email.trim() && formData.message.trim();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md border border-[#e0e0e0] dark:border-[#2a2a2a] bg-white dark:bg-[#0f0f0f] overflow-hidden rounded-xl shadow-xl p-0">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideUpVariants}
          className="p-6 space-y-6"
        >
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-[#111] dark:text-[#eee]">
              Get in touch
            </h2>
            <p className="text-sm text-[#666] dark:text-[#999] mt-1">
              Send me a message and I'll get back to you as soon as possible.
            </p>
          </div>

          {/* Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#999] dark:text-[#666]">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] dark:bg-[#1a1a1a] border border-[#e0e0e0] dark:border-[#2a2a2a] rounded-lg text-sm font-medium text-[#111] dark:text-[#eee] placeholder-[#999] dark:placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#999] dark:text-[#666]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] dark:bg-[#1a1a1a] border border-[#e0e0e0] dark:border-[#2a2a2a] rounded-lg text-sm font-medium text-[#111] dark:text-[#eee] placeholder-[#999] dark:placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Message Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#999] dark:text-[#666]">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your message..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] dark:bg-[#1a1a1a] border border-[#e0e0e0] dark:border-[#2a2a2a] rounded-lg text-sm font-medium text-[#111] dark:text-[#eee] placeholder-[#999] dark:placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={!isFormValid || loading}
                whileHover={isFormValid && !loading ? { scale: 1.02 } : {}}
                whileTap={isFormValid && !loading ? { scale: 0.98 } : {}}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-[#ddd] dark:disabled:bg-[#333] text-white dark:text-[#eee] rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <FiLoader size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend size={16} />
                    Send message
                  </>
                )}
              </motion.button>
            </form>
          ) : (
            /* Success Message */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 text-center space-y-2"
            >
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                Done
              </div>
              <p className="text-sm text-[#666] dark:text-[#999]">
                Thank you for reaching out. I'll be in touch soon!
              </p>
            </motion.div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
