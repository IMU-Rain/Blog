<template>
  <div class="albums-container">
    <div class="photos-container" v-masonry>
      <div class="photo" v-for="photo in photoList" v-masonry-tile>
        <Photo :photo="photo" class="admin"></Photo>
        <div class="photo-meta">
          <span>{{ photo.originalName }}</span>
          <el-button type="danger" plain @click="handleDelete(photo._id)"
            ><el-icon size="20"><Delete /></el-icon
          ></el-button>
        </div>
      </div>
    </div>
    <div class="utils-container">
      <el-button @click="isUploaderActive = isUploaderActive ? false : true"
        ><el-icon size="25"><FolderAdd /></el-icon
      ></el-button>
    </div>
    <div class="upload-container" :class="{ active: isUploaderActive }">
      <div class="cover"></div>
      <div class="window-container">
        <h3>
          上传照片
          <el-button @click="isUploaderActive = false"
            ><el-icon size="20"><Close /></el-icon
          ></el-button>
        </h3>
        <el-input
          placeholder="请输入相册名"
          clearable
          size="large"
          maxlength="50px"
          v-model="albums"
        />
        <el-upload
          :on-success="uploadFinished"
          drag
          name="image"
          v-model:file-list="fileList"
          list-type="picture"
          multiple
          :with-credentials="true"
          :before-upload="photoUpload"
          :action="uploadUrl"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop photos here or <em>click to upload</em>
          </div>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { delPhoto, getAllPhotos } from "../../api/photo";
import { UploadFilled } from "@element-plus/icons-vue";
import Photo from "../../components/Photo.vue";
import { useRequest } from "../../hooks/useRequest";
import axios from "../../api/axios";
import type { PhotoType } from "../../types/photo";
import { Message } from "../../components/Messge";

const url = axios.defaults.baseURL?.slice(0, axios.defaults.baseURL.length - 3);
const { run: getAllPhotosRun, data: photoList } =
  useRequest<[PhotoType]>(getAllPhotos);
const { run: delPhotoRun } = useRequest<{}>(delPhoto);
const handleDelete = (id: string) => {
  if (confirm("您真的要删除这张照片吗")) {
    delPhotoRun(id).finally(() => {
      getAllPhotosRun().then(() => {
        photoList.value?.map((photo) => {
          photo.smallThumbnailPath = `${url}${photo.smallThumbPath}`;
          photo.bigThumbnailPath = `${url}${photo.bigThumbPath}`;
          photo.url = `${url}${photo.path}`;
          return;
        });
      });
    });
  }
};
const uploadUrl = ref("");
const albums = ref("");
const photoUpload = () => {
  if (albums.value.trim() === "") {
    Message.error("相册不能为空，请重新输入并上传");
    return;
  }
  uploadUrl.value = `${url}api/photos/bulk?album=${albums.value}`;
};
const uploadFinished = () => {
  getAllPhotosRun().then(() => {
    photoList.value?.map((photo) => {
      photo.smallThumbnailPath = `${url}${photo.smallThumbPath}`;
      photo.bigThumbnailPath = `${url}${photo.bigThumbPath}`;
      photo.url = `${url}${photo.path}`;
      return;
    });
  });
};
const isUploaderActive = ref(false);
const fileList = ref([]);
onMounted(() => {
  getAllPhotosRun().then(() => {
    photoList.value?.map((photo) => {
      photo.smallThumbnailPath = `${url}${photo.smallThumbPath}`;
      photo.bigThumbnailPath = `${url}${photo.bigThumbPath}`;
      photo.url = `${url}${photo.path}`;
      return;
    });
  });
});
</script>

<style scoped lang="less">
@import "../../style/theme.less";
.albums-container {
  padding: 1rem;
  padding-right: 0;
  .photos-container {
    overflow: scroll;
    .photo {
      width: 300px;
      border-radius: 10px;
      margin-right: 30px;
      margin-bottom: 20px;
      overflow: hidden;
      .admin {
        img {
          height: 300px;
        }
      }
      .photo-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        user-select: none;
        padding: 10px 20px;
        width: 100%;
        background-color: @card-background-color;
        .el-button {
          width: 40px;
          height: 30px;
        }
      }
    }
  }
  .utils-container {
    position: fixed;
    right: 100px;
    top: 100px;
    .el-button {
      width: 40px;
      height: 40px;
    }
    border-radius: 12px;
    overflow: hidden;
  }
  .upload-container {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
    .cover {
      width: 100vw;
      height: 100vh;
      background-color: rgba(280, 280, 280, 0.9);
    }
    .el-input {
      margin-bottom: 10px;
      height: 40px;
      font-size: 20px;
      max-width: 150px;
    }
    .window-container {
      width: 500px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px;
      background-color: @card-background-color;
      border-radius: 10px;
      h3 {
        display: flex;
        justify-content: space-between;
        .el-button {
          padding: 8px 10px;
        }
        margin-bottom: 20px;
      }
    }
  }
  .active {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
