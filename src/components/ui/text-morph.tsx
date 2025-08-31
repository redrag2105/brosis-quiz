"use client";
import { cn } from "@/lib/utils";
import { motion, type Transition, type Variants } from "framer-motion";
import { useMemo, useId, memo } from "react";

export type TextMorphProps = {
  children: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  variants?: Variants;
  transition?: Transition;
};

export const TextMorph = memo(function TextMorph({
  children,
  as: Component = "p",
  className,
  style,
  variants,
  transition,
}: TextMorphProps) {
  const uniqueId = useId();

  const characters = useMemo(() => {
    return children.split("").map((char, index) => {
      const label = char === " " ? "\u00A0" : char;
      return {
        id: `${uniqueId}-${index}-${label}`,
        label,
        index,
      };
    });
  }, [children, uniqueId]);

  const defaultVariants: Variants = {
    initial: () => ({ opacity: 0, y: 10, rotateX: 90 }),
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { delay: i * 0.03 },
    }),
    exit: (i: number) => ({
      opacity: 0,
      y: -10,
      rotateX: -90,
      transition: { delay: i * 0.02 },
    }),
  };

  const defaultTransition: Transition = {
    type: "spring",
    stiffness: 280,
    damping: 20,
    mass: 0.35,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MotionComponent: any = useMemo(() => motion(Component as any), [Component]);
  const textKey = children;

  return (
    <MotionComponent
      key={textKey}
      className={cn(className)}
      aria-label={children}
      style={style}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {characters.map((character) => (
        <motion.span
          key={character.id}
          className="inline-block"
          aria-hidden="true"
          custom={character.index}
          variants={variants || defaultVariants}
          transition={transition || defaultTransition}
        >
          {character.label}
        </motion.span>
      ))}
    </MotionComponent>
  );
});
