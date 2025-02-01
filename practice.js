const os = require("oci-objectstorage");
const common = require("oci-common");
const fs = require("fs");
const path = require("path");

const provider = new common.ConfigFileAuthenticationDetailsProvider(
  "Oracle/oracle.config",
  "DEFAULT"
);

const client = new os.ObjectStorageClient({
  authenticationDetailsProvider: provider,
});

(async () => {
  try {
    //--------READ NAMESPACE--------
    //     console.log("Getting the namespace...");
    //     const request = {};
    //     const response = await client.getNamespace(request);
    //     const namespace = response.value;

    //--------CREATE NAMESPACE--------
    //     console.log("Creating the source bucket.");
    //     const bucketDetails = {
    //       name: bucket,
    //       compartmentId: compartmentId,
    //    };
    //     const createBucketRequest = {
    //       namespaceName: namespace,
    //       createBucketDetails: bucketDetails,
    //     };
    //     const createBucketResponse = await client.createBucket(createBucketRequest);
    //     console.log("Create Bucket executed successfully" + createBucketResponse);

    //--------READ BUCKET--------
    // const getBucketRequest = {
    //   namespaceName: "axgkqzms7vaf",
    //   bucketName: "bucket-20240728-0636",
    // };
    // const getBucketResponse = await client.getBucket(getBucketRequest);
    // console.log(
    //   "Get bucket executed successfully." + getBucketResponse.bucket.name
    // );

    //--------READ Object--------
    const getObjectRequest = {
      objectName: "TestObjdigital-passport.jpg",
      bucketName: "bucket-20240728-0636",
      namespaceName: "axgkqzms7vaf",
    };
    // const getObjectResponse = await client.getObject(getObjectRequest);
    // console.log("Get Object executed successfully.", getObjectResponse.value);

    async function downloadImage(client, getObjectRequest) {
      try {
        const getObjectResponse = await client.getObject(getObjectRequest);
        console.log(
          "Get Object executed successfully.",
          getObjectResponse.value
        );

        // Convert ReadableStream to Buffer
        const readableStream = getObjectResponse.value;
        const chunks = [];

        for await (const chunk of readableStream) {
          chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);

        // Define output file path
        const outputPath = path.join(__dirname, "downloaded-image-dude.jpg");

        // Save buffer to file
        fs.writeFileSync(outputPath, buffer);

        console.log("Image saved successfully to:", outputPath);
      } catch (error) {
        console.error("Error fetching object:", error);
      }
    }

    async function getObjectAndShow() {
      try {
        const getObjectResponse = await client.getObject(getObjectRequest);
        console.log("Get Object executed successfully.");

        // Convert ReadableStream to Buffer
        const chunks = [];
        for await (const chunk of getObjectResponse.value) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Convert Buffer to Base64
        const base64Image = buffer.toString("base64");

        // Create Data URL for image
        const mimeType = "image/png"; // Change if needed (e.g., "image/jpeg")
        const dataUrl = `data:${mimeType};base64,${base64Image}`;

        // Log Data URL (copy and paste into a browser to view)
        console.log("Copy this into your browser to view the image:");
        console.log(dataUrl);
      } catch (error) {
        console.error("Error fetching object:", error);
      }
    }

    getObjectAndShow();

    // Create stream to upload
    // const stats = fs.statSync(fileLocation);
    // const nodeFsBlob = new os.NodeFSBlob(fileLocation, stats.size);
    // const objectData = await nodeFsBlob.getData();

    // console.log("Bucket is created. Now adding object to the Bucket.");
    // const putObjectRequest = {
    //   namespaceName: namespace,
    //   bucketName: bucket,
    //   putObjectBody: objectData,
    //   objectName: object,
    //   contentLength: stats.size,
    // };
    // const putObjectResponse = await client.putObject(putObjectRequest);
    // console.log("Put Object executed successfully" + putObjectResponse);

    // const isSameStream = compareStreams(objectData, getObjectResponse.value);
    // console.log(
    //   `Upload stream and downloaded stream are same? ${isSameStream}`
    // );

    // console.log("Delete Object");
    // const deleteObjectRequest = {
    //   namespaceName: namespace,
    //   bucketName: bucket,
    //   objectName: object,
    // };
    // const deleteObjectResponse = await client.deleteObject(deleteObjectRequest);
    // console.log("Delete Object executed successfully" + deleteObjectResponse);

    // console.log("Delete the Bucket");
    // const deleteBucketRequest = {
    //   namespaceName: namespace,
    //   bucketName: bucket,
    // };
    // const deleteBucketResponse = await client.deleteBucket(deleteBucketRequest);
    // console.log("Delete Bucket executed successfully" + deleteBucketResponse);
  } catch (error) {
    console.log("Error executing example " + error);
  }
})();

// function compareStreams(stream1, stream2) {
//   return streamToString(stream1) === streamToString(stream2);
// }

// function streamToString(stream) {
//   let output = "";
//   stream.on("data", function (data) {
//     output += data.toString();
//   });
//   stream.on("end", function () {
//     return output;
//   });
// }
