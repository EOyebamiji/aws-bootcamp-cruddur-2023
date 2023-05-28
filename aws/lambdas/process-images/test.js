const { getClient, getOriginalImage, processImage, uploadProcessedImage } = require ('./s3-image-processing.js')

async function main(){
  client = getClient()
  const srcBucket = 'eoyebamiji-uploaded-avatars'
  const srcKey = 'eoyebamiji-uploaded-avatars/data.jpg'
  const dstBucket = 'assets.eoyebamiji.com'
  const dstKey = 'processed/data.jpg'
  const width = 256
  const height = 256

  const originalImage = await getOriginalImage(client,srcBucket,srcKey)
  console.log(originalImage)
  const processedImage = await processImage(originalImage,width,height)
  await uploadProcessedImage(client,dstBucket,dstKey,processedImage)
}

main()