import { motion } from "framer-motion";
import { Shield, Lock, CheckCircle, Award } from "lucide-react";

const SecurityBadges = () => {
  const badges = [
    { icon: Shield, label: "SSL Secured" },
    { icon: Lock, label: "256-bit Encryption" },
    { icon: CheckCircle, label: "Verified Merchant" },
    { icon: Award, label: "Trusted Store" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex flex-wrap justify-center gap-4 pt-6 border-t border-border"
    >
      {badges.map((badge, index) => (
        <motion.div
          key={badge.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full border border-border/50"
        >
          <badge.icon className="w-4 h-4 text-gold" />
          <span className="text-cream-muted text-xs font-medium">
            {badge.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SecurityBadges;
