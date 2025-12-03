export async function convertUrlToFile(url: string) {
  const response = await fetch(url, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
  const data = await response.blob();
  const metadata = {
    type: 'image/jpeg',
  };
  const file = new File([data], `${createRandomString(5)}.jpg`, metadata);
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
