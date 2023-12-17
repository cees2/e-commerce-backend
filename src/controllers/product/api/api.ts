import axios from "axios";
import FormData from "form-data";

const googleApiURL = "https://photoslibrary.googleapis.com";

export const createGoogleApiAlbum = (
  name: string
): Promise<Record<string, any>> => {
  const createAlbumBody = {
    album: {
      title: name,
    },
  };
  const createAlbumBodyStringified = JSON.stringify(createAlbumBody);

  return axios.post(`${googleApiURL}/v1/albums`, createAlbumBodyStringified, {
    headers: {
      Authorization: `Bearer ${process.env.GOOGLE_CREATE_ALBUM_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
};

export const getMultimediaToken = (
  // multimedia: File[] | File
  multimedia: File[]
): Promise<Record<string, any>> => {
  // const filesAsFormData = new FormData();

  // if (Array.isArray(multimedia)) {
  //   multimedia.forEach((singleMultimedia, index) => {
  //     // const multimediaDotExtensionIndex =
  //     //   singleMultimedia.originalname.lastIndexOf(".");
  //     // const multimediaName = singleMultimedia.originalname.substring(
  //     //   0,
  //     //   multimediaDotExtensionIndex
  //     // );

  //     filesAsFormData.append(`file-${index}`, JSON.stringify(singleMultimedia));
  //   });
  // } else {
  //   filesAsFormData.append("krzeslo", JSON.stringify(multimedia));
  // }
  console.log(multimedia[0]);
  return axios.post(
    `${googleApiURL}/v1/uploads`,
    //@ts-ignore
    multimedia[0].buffer,
    {
      headers: {
        Authorization: `Bearer ${process.env.GOOGLE_CREATE_MULTIMEDIA_TOKEN}`,
        "Content-Type": "application/octet-stream",
        "X-Goog-Upload-Content-Type": "image/jpeg",
        "X-Goog-Upload-Protocol": "raw",
      },
    }
  );
};

export const createMultimedia = (uploadToken: string, albumId: string) => {
  const createMultimediaRequestBody = {
    albumId,
    newMediaItems: [
      {
        description: "test",
        simpleMediaItem: {
          uploadToken,
          fileName: "TEST1",
        },
      },
    ],
    albumPosition: {
      position: "LAST_IN_ALBUM",
    },
  };
  const createMultimediaRequestBodyStringified = JSON.stringify(
    createMultimediaRequestBody
  );

  return axios.post(
    `${googleApiURL}/v1/mediaItems:batchCreate`,
    createMultimediaRequestBodyStringified,
    {
      headers: {
        Authorization: `Bearer ${process.env.GOOGLE_CREATE_MULTIMEDIA}`,
        "Content-Type": "application/json",
      },
    }
  );
};
