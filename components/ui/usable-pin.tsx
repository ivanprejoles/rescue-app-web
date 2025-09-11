"use client";

import { cn } from "@/lib/utils";
import { PinContainer } from "../ui/3d-pin";
import { GlowingWrapper } from "./glowing-effect";

interface UsablePinInterface {
  title?: string;
  description?: string;
  image?: string;
  background?: string;
  className?: string;
  containerClassName?: string;
}

const UsablePin = ({
  title,
  description,
  image,
  background,
  className,
  containerClassName,
}: UsablePinInterface) => {
  return (
    <div className=" flex items-center justify-center gap-2">
      <PinContainer
        containerClassName={containerClassName}
        href={image}
        title={title}
        className={className}
      >
        <div className="grid basis-full flex-col tracking-tight text-slate-100/50 sm:basis-1/2  gap-2 w-full h-full">
          <GlowingWrapper>
            <div
              className={cn(
                "w-full h-full flex-1 overflow-hidden rounded-lg relative object-cover border-0.75 bg-black dark:shadow-[0px_0px_27px_0px_#2D2D2D]"
              )}
            >
              <img
                className="w-full scale-150 opacity-95  h-full mx-auto left-0 top-0 absolute"
                src={background}
                alt="background"
              />
              <img
                className="w-full h-3/4 opacity-85 mx-auto scale-x-75"
                src={image}
                alt="guide"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full h-auto">
              <h4
                className={cn(
                  "max-w-xs text-sm !m-0  relative z-10  bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-500  text-center font-sans font-extrabold"
                )}
              >
                {title}
              </h4>
              <div className="text-base !m-0 !p-0  font-normal">
                <p
                  className={cn(
                    "font-normal text-xs bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-500  text-center "
                  )}
                >
                  {description}
                </p>
              </div>
            </div>
          </GlowingWrapper>
        </div>
      </PinContainer>
    </div>
  );
};

export default UsablePin;
