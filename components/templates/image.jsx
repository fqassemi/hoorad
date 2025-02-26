import React from 'react';
import useGetImage from '@/hooks/api/image/useGetImg';

const ImageComponent = ({ imageId, className }) => {
  const { data: imageBlob, error } = useGetImage(imageId);

  if (error) return <div>Failed to load image</div>;
  if (!imageBlob) return <div>Loading...</div>;

  const imageUrl = URL.createObjectURL(imageBlob);

  return (
    <img
      src={imageUrl}
      alt="Fetched Image"
      className={className} // Apply the className here
    />
  );
};

export default ImageComponent;
/*
import React from 'react';
import useGetImage from '@/hooks/api/image/useGetImg';

const ImageComponent = ({ imageId }) => {
  const { data: imageBlob, error } = useGetImage(imageId);

  if (error) return <div>Failed to load image</div>;
  if (!imageBlob) return <div>Loading...</div>;

  const imageUrl = URL.createObjectURL(imageBlob);

  return <img src={imageUrl} alt="Fetched Image" />;
};

export default ImageComponent;
*/
