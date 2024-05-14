import fs from "fs";
import path from "path";

const inputDir = "./input";
const outputDir = "./output";
const imagesDir = "images";
const metadataDir = "metadata";
const prefixName='moon blaze'
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

// 打乱数组的辅助函数
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 主处理函数
function processFolders() {
  prepareOutputDirs();

  const subfolders = readSubfolders(inputDir);
  let pairs:any[] = [];

  // 先收集所有文件对
  for (const folder of subfolders) {
    const imagesPath = path.join(inputDir, folder, imagesDir);
    const metadataPath = path.join(inputDir, folder, metadataDir);
    const images = readFilesInFolder(imagesPath);
    const metadata = readFilesInFolder(metadataPath);

    images.forEach((image, index) => {
      pairs.push({
        imagePath: path.join(imagesPath, image),
        metadataPath: path.join(metadataPath, metadata[index])
      });
    });
  }

  // 打乱所有文件对
  shuffleArray(pairs);

  // 复制和重命名图片及元数据
  pairs.forEach((pair, index) => {
    const newImageName = `${prefixName}${index + 1}.webp`;
    const newMetadataName = `${prefixName}${index + 1}.json`;

    fs.copyFileSync(
      pair.imagePath,
      path.join(outputDir, imagesDir, newImageName)
    );

    const metadataContent = JSON.parse(
      fs.readFileSync(pair.metadataPath, "utf-8")
    );
    metadataContent.name = `${prefixName}${index + 1}`;
    metadataContent.image = newImageName;

    fs.writeFileSync(
      path.join(outputDir, metadataDir, newMetadataName),
      JSON.stringify(metadataContent, null, 2)
    );
  });
}

// 运行处理函数
processFolders();
