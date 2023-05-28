import { env } from 'process';
import { getClient, getOriginalImage, processImage, uploadProcessedImage } from './s3-image-processing.js';
import { parse } from 'path';

const bucketName = env.DEST_BUCKET_NAME
const folderInput = env.FOLDER_INPUT
const folderOutput = env.FOLDER_OUTPUT
const width = parseInt(env.PROCESS_WIDTH)
const height = parseInt(env.PROCESS_HEIGHT)

const client = getClient();

export async function handler(event) {
  const srcBucket = event.Records[0].s3.bucket.name;
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  console.log('srcBucket',srcBucket)
  console.log('srcKey',srcKey)

  const dstBucket = bucketName;

  filename = parse(srcKey).name
  const dstKey = `${/*folderInput*/ folderOutput}/${filename}.jpg`
  console.log('dstBucket',dstBucket)
  console.log('dstKey',dstKey)

  const originalImage = await getOriginalImage(client,srcBucket,srcKey)
  const processedImage = await processImage(originalImage,width,height)
  await uploadProcessedImage(client,dstBucket,dstKey,processedImage)
}