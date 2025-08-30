import type { AvatarConfig, House } from "../../types";
import { cn } from "../../lib/utils";

interface AvatarProps {
  config: AvatarConfig; // { accessory }
  size?: number; // px
  className?: string;
  baseSkin?: House | string; // render from public/characters/Skin
}

export function Avatar({
  config,
  size = 96,
  className,
  baseSkin = "faerie",
}: AvatarProps) {
  const s = size;
  return (
    <div
      className={cn("inline-block rounded-2xl overflow-hidden", className)}
      style={{ width: s, height: s }}
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        {/* Base skin from assets */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore - href is valid for SVG <image> */}
        <image
          href={`/characters/Skin/${baseSkin}.svg`}
          x={s * 0.1}
          y={s * 0.08}
          width={s * 0.8}
          height={s * 0.8}
          preserveAspectRatio="xMidYMid meet"
        />
        {/* Accessory overlay */}
        {config.accessory && config.accessory !== "none" && (
          <image
            href={`/characters/Accessory/${config.accessory}.svg`}
            x={s * 0.1}
            y={s * 0.08}
            width={s * 0.8}
            height={s * 0.8}
            preserveAspectRatio="xMidYMid meet"
          />
        )}
      </svg>
    </div>
  );
}

export default Avatar;
