import fs from "fs";
import path from "path";

const inputDir = "./input";
const outputDir = "./output";
const imagesDir = "images";
const metadataDir = "metadata";

// 准备输出文件夹
function prepareOutputDirs() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
    fs.mkdirSync(path.join(outputDir, imagesDir));
    fs.mkdirSync(path.join(outputDir, metadataDir));
  }
}

// 读取所有子文件夹
function readSubfolders(parentFolder: string) {
  return fs
    .readdirSync(parentFolder, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

// 读取文件夹内的文件
function readFilesInFolder(folderPath: string) {
  return fs.readdirSync(folderPath).filter((file) => file.endsWith(".webp") || file.endsWith(".png") || file.endsWith(".json"));
}

// 主处理函数
function processFolders() {
  prepareOutputDirs();

  const subfolders = readSubfolders(inputDir);
  let globalIndex = 1;

  for (const folder of subfolders) {
    const imagesPath = path.join(inputDir, folder, imagesDir);
    const metadataPath = path.join(inputDir, folder, metadataDir);
    const images = readFilesInFolder(imagesPath);
    const metadata = readFilesInFolder(metadataPath);

    // 随机打乱数组
    const shuffledIndices = images.map((_, index) => index);
    shuffleArray(shuffledIndices);

    for (let i = 0; i < images.length; i++) {
      const imageIndex = shuffledIndices[i];
      const imageName = images[imageIndex];
      const metadataName = metadata[imageIndex];

      const newImageName = `T_${globalIndex}.webp`;
      const newMetadataName = `T_${globalIndex}.json`;

      // 复制和重命名图片
      fs.copyFileSync(
        path.join(imagesPath, imageName),
        path.join(outputDir, imagesDir, newImageName)
      );

      // 读取、修改并保存metadata
      const metadataContent = JSON.parse(
        fs.readFileSync(path.join(metadataPath, metadataName), "utf-8")
      );
      metadataContent.name = `T-${globalIndex}`;
      metadataContent.image = newImageName;

      fs.writeFileSync(
        path.join(outputDir, metadataDir, newMetadataName),
        JSON.stringify(metadataContent, null, 2)
      );

      globalIndex++;
    }
  }
}

// 打乱数组的辅助函数
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 运行处理函数
processFolders();
