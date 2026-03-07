import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
}

export default function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (!containerRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const spans =
      containerRef.current.querySelectorAll<HTMLSpanElement>("[data-split]");

    gsap.set(spans, from);

    gsap.to(spans, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      onComplete: onLetterAnimationComplete,
    });
  }, [delay, duration, ease, from, to, onLetterAnimationComplete]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animate, threshold, rootMargin]);

  const renderContent = () => {
    if (splitType === "words") {
      return text.split(" ").map((word, i) => (
        <span key={i} data-split style={{ display: "inline-block", opacity: 0 }}>
          {word}
          {i < text.split(" ").length - 1 && "\u00A0"}
        </span>
      ));
    }

    // chars — preserve spaces between words
    return text.split("").map((char, i) => (
      <span
        key={i}
        data-split
        style={{
          display: "inline-block",
          opacity: 0,
          whiteSpace: char === " " ? "pre" : undefined,
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <p ref={containerRef} className={className} style={{ textAlign }}>
      {renderContent()}
    </p>
  );
}
