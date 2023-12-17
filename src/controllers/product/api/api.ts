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
  buffer: string
): Promise<Record<string, any>> => {
  return axios.post(
    `${googleApiURL}/v1/uploads`,
    buffer,
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
