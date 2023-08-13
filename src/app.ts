import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
  readdir,
  unlink,
  rmdir,
  stat,
} from "fs";
import path from "path";
const name = "t-";
const A_folder = "./input/seriesOne";
const B_folder = "./input/seriesTwo";
const C_folder = "./output/NEW_COMBO";
// 打乱顺序
const shuffleArray = (images: any[], metadata: any[]) => {
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
    [metadata[i], metadata[j]] = [metadata[j], metadata[i]];
  }
  return [images, metadata];
};

// 复制和重命名
const copyAndRenameFiles = (
  sourceFolder: string,
  destinationFolder: string,
  startNumber: number
) => {
  const imagesPath = path.join(sourceFolder, "images");
  const metadataPath = path.join(sourceFolder, "metadata");

  const images = readdirSync(imagesPath);
  const metadata = readdirSync(metadataPath);

  images.forEach((image, index) => {
    const correspondingMetadata = metadata[index];

    const newImageName = name + (startNumber + index) + ".png";
    const newMetadataName = name + (startNumber + index) + ".json";

    copyFileSync(
      path.join(imagesPath, image),
      path.join(destinationFolder, "images", newImageName)
    );
    copyFileSync(
      path.join(metadataPath, correspondingMetadata),
      path.join(destinationFolder, "metadata", newMetadataName)
    );
  });
};

const shuffleAndRenameFiles = (
  images: string[],
  metadata: string[],
  folderPath: string
) => {
  // const shuffledImages = shuffleArray(images);
  // const shuffledMetadata = shuffleArray(metadata);
  const [shuffledImages, shuffledMetadata] = shuffleArray(images, metadata);
  console.log(
    `shuffledImages 随机重组：`,
    shuffledImages.length,
    shuffledMetadata.length
  );
  shuffledImages.forEach((image, index) => {
    const newName = "PUMP" + (index + 1) + ".png";
    renameSync(
      path.join(folderPath, "images", image),
      path.join(folderPath, "images", newName)
    );
  });

  shuffledMetadata.forEach((metadataFile, index) => {
    const newName = index + 1 + ".json";
    const metadataContent = JSON.parse(
      readFileSync(path.join(folderPath, "metadata", metadataFile), "utf-8")
    );

    // 更新name和image的序号
    metadataContent.name = "PUMP #" + (index + 1).toString();
    metadataContent.image = "PUMP" + (index + 1) + ".png";

    // 写入新的JSON文件
    writeFileSync(
      path.join(folderPath, "metadata", newName),
      JSON.stringify(metadataContent, null, 2)
    );
  });
};

const combineAndShuffleFolders = () => {
  if (!existsSync(C_folder)) {
    mkdirSync(C_folder);
    mkdirSync(path.join(C_folder, "images"));
    mkdirSync(path.join(C_folder, "metadata"));
  }

  copyAndRenameFiles(A_folder, C_folder, 1);
  // copyAndRenameFiles(B_folder, C_folder, 4445);
  copyAndRenameFiles(B_folder, C_folder, 4445);

  const images = readdirSync(path.join(C_folder, "images"));
  const metadata = readdirSync(path.join(C_folder, "metadata"));
  console.log(`随机重组：`, images.length, metadata.length);

  shuffleAndRenameFiles(images, metadata, C_folder);
  // const shuffledMetadata = shuffleArray(metadata);
};

function clearFolder(folderPath: string): void {
  readdir(folderPath, (err, files) => {
    if (err) {
      console.error("读取文件夹内容失败：", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      stat(filePath, (statErr, stats) => {
        if (statErr) {
          console.error(`获取文件状态失败：`, statErr);
          return;
        }

        if (stats.isDirectory()) {
          clearFolder(filePath); // 递归处理子文件夹
        } else {
          unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error(`删除文件失败：`, unlinkErr);
            } else {
              console.log(`已删除文件：${filePath}`);
            }
          });
        }
      });
    });

    // 清空文件夹后删除文件夹本身
    rmdir(folderPath, (rmdirErr) => {
      if (rmdirErr) {
        console.error(`删除文件夹失败：`, rmdirErr);
      } else {
        console.log(`已删除文件夹：${folderPath}`);
      }
    });
  });
}

// clearFolder(C_folder);
combineAndShuffleFolders();


