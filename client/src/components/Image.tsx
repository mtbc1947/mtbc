import React from "react";
import { IKImage } from "imagekitio-react";

interface ImageProps {
  src: string;
  className?: string;
  w?: number | string;
  h?: number | string;
  alt?: string;
}

const Image: React.FC<ImageProps> = ({ src, className, w, h, alt }) => {
  return (
    <IKImage
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      path={src}
      alt={alt}
      className={className}
      loading="lazy"
      width={w}
      height={h}
    />
  );
};

export default Image;
