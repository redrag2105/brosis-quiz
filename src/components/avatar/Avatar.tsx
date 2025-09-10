import type { AvatarConfig, House } from "../../types";
import { cn } from "../../lib/utils";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState, useId } from "react";
import type React from "react";

type SvgImageProps = React.SVGProps<SVGImageElement> & { href: string };
const SvgImage = (props: SvgImageProps) => <image {...props} />;

interface AvatarProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
  baseSkin?: House | string;
}

export function Avatar({
  config,
  size = 96,
  className,
  baseSkin = "faerie",
}: AvatarProps) {
  const s = size;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const uidRaw = useId();
  const uid = uidRaw.replace(/:/g, "_");

  const [currentSkin, setCurrentSkin] = useState<string>(String(baseSkin));

  // shirt layer state
  const [currentShirt, setCurrentShirt] = useState<string | undefined>(config.shirt);
  const [prevShirt, setPrevShirt] = useState<string | null>(null);
  const [prevSkin, setPrevSkin] = useState<string | null>(null);

  const [currentAcc, setCurrentAcc] = useState<string>(config.accessory);
  const [prevAcc, setPrevAcc] = useState<string | null>(null);

  useEffect(() => {
    const next = String(baseSkin);
    if (next !== currentSkin) {
      setPrevSkin(currentSkin);
      setCurrentSkin(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseSkin]);

  useEffect(() => {
    const next = config.accessory;
    if (next !== currentAcc) {
      setPrevAcc(currentAcc);
      setCurrentAcc(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.accessory]);

  useEffect(() => {
    const next = config.shirt;
    if (next !== currentShirt) {
      setPrevShirt(currentShirt ?? null);
      setCurrentShirt(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.shirt]);

  // Skin reveal animation (isolated)
  useLayoutEffect(() => {
    if (!containerRef.current || !prevSkin) return;
    const circle = containerRef.current.querySelector(
      `#revealCircleSkin-${uid}`
    ) as SVGCircleElement | null;
    const blur = containerRef.current.querySelector(
      `#revealBlurSkin-${uid}`
    ) as SVGFEGaussianBlurElement | null;

    const ctx = gsap.context(() => {
      gsap.killTweensOf([`#skin-prev-${uid}`, circle, blur]);
      if (circle) {
        gsap.set(circle, { attr: { r: 0, cx: s * 0.5, cy: s * 0.5 } });
        gsap.to(circle, { attr: { r: s }, duration: 0.27, ease: "power3.out" });
      }
      if (blur) {
        gsap.fromTo(
          blur,
          { attr: { stdDeviation: 2 } },
          { attr: { stdDeviation: 0 }, duration: 0.3, ease: "power2.out" }
        );
      }
      gsap.to(`#skin-prev-${uid}`, {
        opacity: 0,
        duration: 0.27,
        ease: "power2.inOut",
        onComplete: () => setPrevSkin(null),
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prevSkin, s, uid]);

  // Accessory reveal animation (separate clipPath)
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const circle = containerRef.current.querySelector(
      `#revealCircleAcc-${uid}`
    ) as SVGCircleElement | null;
    const blur = containerRef.current.querySelector(
      `#revealBlurAcc-${uid}`
    ) as SVGFEGaussianBlurElement | null;

    const ctx = gsap.context(() => {
      gsap.killTweensOf([
        `#acc-current-${uid}`,
        `#acc-prev-${uid}`,
        circle,
        blur,
      ]);

      if (prevAcc && prevAcc !== "none") {
        if (circle) {
          gsap.set(circle, { attr: { r: 0, cx: s * 0.5, cy: s * 0.5 } });
          gsap.to(circle, {
            attr: { r: s },
            duration: 0.5,
            ease: "power3.out",
          });
        }
        if (blur) {
          gsap.fromTo(
            blur,
            { attr: { stdDeviation: 1.5 } },
            { attr: { stdDeviation: 0 }, duration: 0.36, ease: "power2.out" }
          );
        }
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        tl.to(`#acc-current-${uid}`, { opacity: 1, duration: 0.36 }, 0);
        tl.to(`#acc-prev-${uid}`, { opacity: 0, duration: 0.25 }, 0);
        tl.add(() => setPrevAcc(null));
      } else {
        gsap.set(`#acc-current-${uid}`, {
          opacity: currentAcc && currentAcc !== "none" ? 1 : 0,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [currentAcc, prevAcc, s, uid]);

  // Shirt reveal animation (similar to accessory)
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const circle = containerRef.current.querySelector(
      `#revealCircleShirt-${uid}`
    ) as SVGCircleElement | null;
    const blur = containerRef.current.querySelector(
      `#revealBlurShirt-${uid}`
    ) as SVGFEGaussianBlurElement | null;

    const ctx = gsap.context(() => {
      gsap.killTweensOf([
        `#shirt-current-${uid}`,
        `#shirt-prev-${uid}`,
        circle,
        blur,
      ]);

      if (prevShirt && prevShirt !== "none") {
        if (circle) {
          gsap.set(circle, { attr: { r: 0, cx: s * 0.5, cy: s * 0.5 } });
          gsap.to(circle, {
            attr: { r: s },
            duration: 0.48,
            ease: "power3.out",
          });
        }
        if (blur) {
          gsap.fromTo(
            blur,
            { attr: { stdDeviation: 1.2 } },
            { attr: { stdDeviation: 0 }, duration: 0.34, ease: "power2.out" }
          );
        }
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        tl.to(`#shirt-current-${uid}`, { opacity: 1, duration: 0.34 }, 0);
        tl.to(`#shirt-prev-${uid}`, { opacity: 0, duration: 0.24 }, 0);
        tl.add(() => setPrevShirt(null));
      } else {
        gsap.set(`#shirt-current-${uid}`, {
          opacity: currentShirt && currentShirt !== "none" ? 1 : 0,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [currentShirt, prevShirt, s, uid]);

  return (
    <div
      ref={containerRef}
      className={cn("inline-block rounded-2xl overflow-hidden", className)}
      style={{ width: s, height: s }}
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <defs>
          <clipPath id={`revealClipSkin-${uid}`}>
            <circle
              id={`revealCircleSkin-${uid}`}
              cx={s * 0.5}
              cy={s * 0.5}
              r={s}
            />
          </clipPath>
          <filter
            id={`revealFilterSkin-${uid}`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur
              id={`revealBlurSkin-${uid}`}
              in="SourceGraphic"
              stdDeviation="0"
            />
          </filter>

          <clipPath id={`revealClipAcc-${uid}`}>
            <circle
              id={`revealCircleAcc-${uid}`}
              cx={s * 0.5}
              cy={s * 0.5}
              r={s}
            />
          </clipPath>
          <filter
            id={`revealFilterAcc-${uid}`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur
              id={`revealBlurAcc-${uid}`}
              in="SourceGraphic"
              stdDeviation="0"
            />
          </filter>

          <clipPath id={`revealClipShirt-${uid}`}>
            <circle
              id={`revealCircleShirt-${uid}`}
              cx={s * 0.5}
              cy={s * 0.5}
              r={s}
            />
          </clipPath>
          <filter
            id={`revealFilterShirt-${uid}`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur
              id={`revealBlurShirt-${uid}`}
              in="SourceGraphic"
              stdDeviation="0"
            />
          </filter>
        </defs>

        {prevSkin && (
          <SvgImage
            id={`skin-prev-${uid}`}
            href={`/characters/Skin/${prevSkin}.svg`}
            x={s * 0.1}
            y={s * 0.08}
            width={s * 0.8}
            height={s * 0.8}
            preserveAspectRatio="xMidYMid meet"
            opacity={1}
          />
        )}
        <SvgImage
          id={`skin-current-${uid}`}
          href={`/characters/Skin/${currentSkin}.svg`}
          x={s * 0.1}
          y={s * 0.08}
          width={s * 0.8}
          height={s * 0.8}
          preserveAspectRatio="xMidYMid meet"
          opacity={prevSkin ? 0 : 1}
          clipPath={`url(#revealClipSkin-${uid})`}
          filter={`url(#revealFilterSkin-${uid})`}
        />

        {prevShirt && prevShirt !== "none" && (
          <SvgImage
            id={`shirt-prev-${uid}`}
            href={`/characters/Accessory/${prevShirt}.svg`}
            x={s * 0.1}
            y={s * 0.08}
            width={s * 0.8}
            height={s * 0.8}
            preserveAspectRatio="xMidYMid meet"
            opacity={1}
          />
        )}

        {currentShirt && currentShirt !== "none" && (
          <SvgImage
            id={`shirt-current-${uid}`}
            href={`/characters/Accessory/${currentShirt}.svg`}
            x={s * 0.1}
            y={s * 0.08}
            width={s * 0.8}
            height={s * 0.8}
            preserveAspectRatio="xMidYMid meet"
            opacity={prevShirt ? 0 : 1}
            clipPath={`url(#revealClipShirt-${uid})`}
            filter={`url(#revealFilterShirt-${uid})`}
          />
        )}

        {prevAcc && prevAcc !== "none" && (
          <SvgImage
            id={`acc-prev-${uid}`}
            href={`/characters/Accessory/${prevAcc}.svg`}
            x={s * 0.1}
            y={s * 0.08}
            width={s * 0.8}
            height={s * 0.8}
            preserveAspectRatio="xMidYMid meet"
            opacity={1}
          />
        )}

        {currentAcc && currentAcc !== "none" && (
          <SvgImage
            id={`acc-current-${uid}`}
            href={`/characters/Accessory/${currentAcc}.svg`}
            x={s * 0.1}
            y={s * 0.08}
            width={s * 0.8}
            height={s * 0.8}
            preserveAspectRatio="xMidYMid meet"
            opacity={prevAcc ? 0 : 1}
            clipPath={`url(#revealClipAcc-${uid})`}
            filter={`url(#revealFilterAcc-${uid})`}
          />
        )}
      </svg>
    </div>
  );
}

export default Avatar;
