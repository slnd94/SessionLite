import React from "react";
import Script from "next/script";

const PaddleLoader = () => {
  return (
    <Script src="https://cdn.paddle.com/paddle/paddle.js"
      onLoad={() => {
        Paddle.Environment.set(process.env.NEXT_PADDLE_ENV);
        Paddle.Setup({
          vendor: Number(process.env.NEXT_PADDLE_VENDOR_ID)
        });
      }}
    />
  );
};

export default PaddleLoader;
