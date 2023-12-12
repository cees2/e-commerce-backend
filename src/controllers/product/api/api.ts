import axios from "axios";
import FormData from "form-data"

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
  multimedia: File[] | File
): Promise<Record<string, any>> => {
  const filesAsFormData = new FormData();

  if (Array.isArray(multimedia)) {
    multimedia.forEach((singleMultimedia, index) => {
      filesAsFormData.append(index.toString(), JSON.stringify(singleMultimedia));
    });
  } else {
    filesAsFormData.append("krzeslo", JSON.stringify(multimedia));
  }
  return axios.post(`${googleApiURL}/v1/uploads`, filesAsFormData, {
    headers: {
      Authorization: `Bearer ${process.env.GOOGLE_CREATE_MULTIMEDIA_TOKEN}`,
      "Conent-Type": "application/octet-stream",
    },
  });
};

export const createMultimedia = (uploadToken: string, albumId: string) => {
  const createMultimediaRequestBody = {
    albumId,
    newMediaItems: [
      {
        description: "test",
        simpleMediaItem: {
          uploadToken,
          fileName: "TEST",
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
