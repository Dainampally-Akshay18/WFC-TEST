export const extractYoutubeId = (url) => {
  if (!url) return null;

  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?\n]*).*/;
  const match = url.match(regExp);
  
  return match && match[7].length === 11 ? match[7] : null;
};

export default extractYoutubeId;
