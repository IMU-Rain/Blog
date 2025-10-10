const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}
async function mkThumbnail(absInputPath, absOutputDir, filename, width = 700) {
  try {
    await ensureDir(absOutputDir);
    const ext = path.extname(filename);
    const name = path.basename(filename);
    const thumbnailName = `${name}_thumbail${ext}`;
    const absOutputPath = path.join(absOutputDir, thumbnailName);
    const img = sharp(absInputPath).resize({ width, withoutEnlargement: true });
    const { width: w, height: h } = await img.toFile(absOutputPath);
    return { absOutputPath, thumbnailName, width: w, height: h };
  } catch (err) {
    console.log(err);
    return err;
  }
}
module.exports = { mkThumbnail };
