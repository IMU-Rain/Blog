import useReuest from "../utils/useRequest";

export interface UploadToAlbumPayload {
  id: string[];
  album?: string;
}

export interface UpdatePhotoMetaPayload {
  name?: string;
  originalName?: string;
  description?: string;
  album?: string;
  tags?: string[] | string;
}

export function addPhotosToAlbum(payload: UploadToAlbumPayload) {
  return useReuest("post", "/photos", payload);
}

export function getPhotos() {
  return useReuest("get", "/photos");
}

export function getPhotosByAlbum(album: string) {
  return useReuest("get", "/photos/album", { album });
}

export function deletePhotos(ids: string[]) {
  return useReuest("delete", "/photos", {
    data: {
      id: ids,
    },
  });
}

export function createPhotoExpert(id: string) {
  return useReuest("post", "/photos/expert", { id });
}

export function getPhotoDetail(id: string) {
  return useReuest("get", `/photos/${id}`);
}

export function updatePhotoMeta(id: string, payload: UpdatePhotoMetaPayload) {
  return useReuest("put", `/photos/${id}`, payload);
}
