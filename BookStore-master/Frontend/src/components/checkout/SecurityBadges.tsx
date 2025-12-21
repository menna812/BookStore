import { motion } from "framer-motion";
import { Shield, Lock, CheckCircle, Award } from "lucide-react";

const SecurityBadges = () => {
  const badges = [
    { icon: Shield, label: "SSL Secured" },
    { icon: Lock, label: "256-bit Encryption" },
    { icon: CheckCircle, label: "PCI Compliant" },
    { icon: Award, label: "Trusted Store" },
  ];

  return (
    <div className="security-badges">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + index * 0.05 }}
          className="security-badge"
        >
          <badge.icon size={16} />
          <span>{badge.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default SecurityBadges;