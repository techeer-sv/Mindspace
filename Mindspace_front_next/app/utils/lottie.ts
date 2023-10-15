export const getLottieOptions = (path: string) => {
  return {
    loop: true,
    autoplay: true,
    path: path,
    animationData: null,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
};
