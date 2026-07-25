"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Wraps a section with a scroll-triggered fade + slide-up animation.
 * Respects prefers-reduced-motion: skips the y-offset, only fades.
 * 
 * @example
 * <RevealSection className="bg-[var(--background)] px-4">
 *   <h2>Your content</h2>
 * </RevealSection>
 */
export function RevealSection({ 
  children, 
  className = "", 
  delay = 0 
}: RevealSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ 
        duration: 0.7, 
        ease: [0.25, 0.1, 0.25, 1], // Smooth easing curve
        delay 
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * For staggering individual items inside a revealed section (cards, steps, etc.).
 * Use delay={index * 0.1} at the call site.
 * 
 * @example
 * {items.map((item, index) => (
 *   <RevealItem key={item.id} delay={index * 0.08}>
 *     <Card {...item} />
 *   </RevealItem>
 * ))}
 */
export function RevealItem({ 
  children, 
  className = "", 
  delay = 0 
}: RevealItemProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ 
        duration: 0.55, 
        ease: [0.25, 0.1, 0.25, 1], // Smooth easing curve
        delay 
      }}
    >
      {children}
    </motion.div>
  );
}