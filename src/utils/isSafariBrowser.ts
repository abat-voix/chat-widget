export const isSafariBrowser = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  return userAgent.includes('safari') && !userAgent.includes('chrome')
}
