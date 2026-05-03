import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { FiSend, FiLoader } from "react-icons/fi";
import { useState, useEffect } from "react";
import { sendDiscordMessage, createContactMessage } from "@/lib/discord";
import Lanyard from "@/components/Lanyard";

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
  const [lanyardReady, setLanyardReady] = useState(false);
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

  const cardGlbUrl = `${import.meta.env.BASE_URL}assets/lanyard/card.glb`;
  const lanyardPngUrl = `${import.meta.env.BASE_URL}assets/lanyard/lanyard.png`;

  useEffect(() => {
    let mounted = true;

    const checkAssets = async () => {
      try {
        const card = await fetch(cardGlbUrl, { method: "HEAD" });
        const texture = await fetch(lanyardPngUrl, { method: "HEAD" });
        const cardType = card.headers.get("content-type")?.toLowerCase() ?? "";
        const textureType = texture.headers.get("content-type")?.toLowerCase() ?? "";

        const cardLooksValid = card.ok && !cardType.includes("text/html");
        const textureLooksValid = texture.ok && textureType.includes("image/png");

        if (mounted && cardLooksValid && textureLooksValid) {
          setLanyardReady(true);
        } else if (mounted) {
          setLanyardReady(false);
        }
      } catch {
        if (mounted) {
          setLanyardReady(false);
        }
      }
    };

    checkAssets();
    return () => {
      mounted = false;
    };
  }, [cardGlbUrl, lanyardPngUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md border border-base bg-panel overflow-hidden rounded-xl shadow-xl p-0">
        <DialogTitle className="sr-only">Contact form</DialogTitle>
        <DialogDescription className="sr-only">
          Send a message using the contact form.
        </DialogDescription>
        <div className="border-b border-base bg-gradient-to-b from-brand/20 to-transparent">
          {lanyardReady ? (
            <Lanyard position={[0, 0, 24]} gravity={[0, -40, 0]} />
          ) : (
            <div className="h-24 px-6 flex items-center text-xs text-sub">
              Missing or invalid lanyard assets. Add `card.glb` and `lanyard.png` to `public/assets/lanyard`.
            </div>
          )}
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideUpVariants}
          className="p-6 space-y-6"
        >
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-main">
              Get in touch
            </h2>
            <p className="text-sm text-sub mt-1">
              Send me a message and I'll get back to you as soon as possible.
            </p>
          </div>

          {/* Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-faint">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 bg-field border border-base rounded-lg text-sm font-medium text-main placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-faint">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 bg-field border border-base rounded-lg text-sm font-medium text-main placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>

              {/* Message Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-faint">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your message..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-field border border-base rounded-lg text-sm font-medium text-main placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={!isFormValid || loading}
                whileHover={isFormValid && !loading ? { scale: 1.02 } : {}}
                whileTap={isFormValid && !loading ? { scale: 0.98 } : {}}
                className="w-full px-4 py-3 bg-brand hover:bg-brand-hover disabled:bg-field text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
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
              <p className="text-sm text-sub">
                Thank you for reaching out. I'll be in touch soon!
              </p>
            </motion.div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
