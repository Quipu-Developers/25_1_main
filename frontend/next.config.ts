const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      "cdn.jsdelivr.net", // 기술 스택 이미지
      "pub-e688831beea1479f8b217d983b99b523.r2.dev", // (퀴푸 Cloudflare)
      "pub-880f96b9aa254fce88011c97e585d2bd.r2.dev", // (퀴푸 Cloudflare)
      "zippy.b-cdn.net", // (이예나 개인 Cloudflare + BunnyCDN)
      "pub-80a42cc7d41749078071917a4265d3ca.r2.dev", // (이예나 개인 Cloudflare)
    ],
  },
};

export default nextConfig;
