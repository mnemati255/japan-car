export async function convertUrlToFile(url: string) {
  // const response = await fetch(url);
  // const data = await response.blob();
  // const metadata = {
  //   type: 'image/jpeg',
  // };
  // const file = new File([data], `${createRandomString(5)}.jpg`, metadata);
  // return file;
  console.log(url)
  const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`);
  const blob = await response.blob();

  const file = new File([blob], `${createRandomString(5)}.png`, {
    type: blob.type,
  });

  return file;
}

function createRandomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
