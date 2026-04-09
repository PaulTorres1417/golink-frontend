
export const cloudinaryImage = (url: string, width: number, height: number) => {
  return url.replace(
    '/upload/',
    `/upload/w_${width},h_${height},c_fill,f_auto,q_auto/`
  );
};