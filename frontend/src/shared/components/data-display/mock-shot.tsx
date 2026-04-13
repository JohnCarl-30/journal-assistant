import Image from "next/image";

import { cn } from "@/shared/lib/utils";

type MockShotProps = {
  src: string;
  alt: string;
  title?: string;
  meta?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function MockShot({
  src,
  alt,
  title,
  meta,
  className,
  imageClassName,
  priority = false,
}: MockShotProps) {
  return (
    <div
      className={cn(
        "hover-rise group relative overflow-hidden rounded-[1.6rem] border border-[rgba(223,231,225,0.96)] bg-white/92 shadow-paper",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 z-0 h-14 rounded-full bg-[radial-gradient(circle,rgba(87,195,174,0.18),transparent_72%)] blur-2xl" />

      <div className="relative z-10 aspect-[4/3] overflow-hidden border-b editorial-rule bg-[rgba(245,247,243,0.84)]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 33vw"
          className={cn(
            "object-cover object-top transition duration-700 group-hover:scale-[1.03]",
            imageClassName,
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(24,51,45,0.22)] via-transparent to-[rgba(255,255,255,0.06)]" />
      </div>

      {title || meta ? (
        <div className="relative z-10 space-y-1 px-4 py-4">
          {title ? <p className="text-sm font-semibold text-foreground">{title}</p> : null}
          {meta ? <p className="text-xs leading-5 text-muted-foreground">{meta}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
