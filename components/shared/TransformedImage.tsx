"use client";
import { dataUrl, debounce, getImageSize } from "@/lib/utils";
import { CldImage } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Button } from "../ui/button";

const TransformedImage = ({
  image,
  type,
  // title,
  transformationConfig,
  isTransforming,
  setIsTransforming,
  hasDownload = false,
}: TransformedImageProps) => {
  const downloadHandler = () => {
    // TODO: Implement download functionality
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="h3-bold text-dark-600">Transformed</h3>

        {hasDownload && (
          <Button
            className="download-btn bg-transparent hover:bg-transparent cursor-pointer"
            onClick={downloadHandler}
          >
            <Image
              src="/assets/icons/download.svg"
              alt="Download"
              width={24}
              height={24}
              className="pb-1.5"
            />
          </Button>
        )}
      </div>

      {image?.publicId && transformationConfig ? (
        <div className="relative">
          <CldImage
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            src={image?.publicId}
            alt={"iamge"}
            sizes={"(max-width: 768px) 100vw, 50vw"}
            placeholder={dataUrl as PlaceholderValue}
            className="transformed-image"
            onLoad={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              setIsTransforming && setIsTransforming(false);
            }}
            onError={() => {
              debounce(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                setIsTransforming && setIsTransforming(false);
              }, 800);
            }}
            {...transformationConfig}
          />

          {isTransforming && (
            <div className="flex justify-center items-center absolute left-[50%] top-[50%] size-full -translate-x-1/2 -translate-y-1/2 flex-col gap-2 rounded-[10px] border bg-dark-700/90">
              <Image
                src="/assets/icons/spinner.svg"
                alt="trmsforming"
                width={40}
                height={40}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="transformed-placeholder">Transformed image</div>
      )}
    </div>
  );
};

export default TransformedImage;
