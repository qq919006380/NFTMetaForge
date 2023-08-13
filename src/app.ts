import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from "fs"
import path from "path";

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
const copyAndRenameFiles = (sourceFolder: string, destinationFolder: string, startNumber: number) => {
    const imagesPath = path.join(sourceFolder, 'images');
    const metadataPath = path.join(sourceFolder, 'metadata');

    const images = readdirSync(imagesPath);
    const metadata = readdirSync(metadataPath);

    images.forEach((image, index) => {
        const correspondingMetadata = metadata[index];

        const newImageName = 'TEMP_PUMP_' + (startNumber + index) + '.png';
        const newMetadataName = 'TEMP_PUMP_' + (startNumber + index) + '.json';

        copyFileSync(path.join(imagesPath, image), path.join(destinationFolder, 'images', newImageName));
        copyFileSync(path.join(metadataPath, correspondingMetadata), path.join(destinationFolder, 'metadata', newMetadataName));
    });
};

const shuffleAndRenameFiles = (images: string[], metadata: string[], folderPath: string) => {
    // const shuffledImages = shuffleArray(images);
    // const shuffledMetadata = shuffleArray(metadata);
    const [shuffledImages, shuffledMetadata] = shuffleArray(images, metadata);
    console.log(`shuffledImages 随机重组：`, shuffledImages.length, shuffledMetadata.length)
    shuffledImages.forEach((image, index) => {
        const newName = 'PUMP' + (index + 1) + '.png';
        renameSync(path.join(folderPath, 'images', image), path.join(folderPath, 'images', newName));
    });

    shuffledMetadata.forEach((metadataFile, index) => {
        const newName = (index + 1) + '.json';
        const metadataContent = JSON.parse(readFileSync(path.join(folderPath, 'metadata', metadataFile), 'utf-8'));

        // 更新name和image的序号
        metadataContent.name = 'PUMP #' + (index + 1).toString();
        metadataContent.image = "PUMP" + (index + 1) + '.png';

        // 写入新的JSON文件
        writeFileSync(path.join(folderPath, 'metadata', newName), JSON.stringify(metadataContent, null, 2));
    });
};


const combineAndShuffleFolders = () => {
    const A_folder = './main/PUMPAllColor';
    const B_folder = './main/PUMPAllColorwithTube';
    const C_folder = './main/NEW_PUMP';

    if (!existsSync(C_folder)) {
        mkdirSync(C_folder);
        mkdirSync(path.join(C_folder, 'images'));
        mkdirSync(path.join(C_folder, 'metadata'));
    }

    copyAndRenameFiles(A_folder, C_folder, 1);
    // copyAndRenameFiles(B_folder, C_folder, 4445);
    copyAndRenameFiles(B_folder, C_folder, 4445);


    const images = readdirSync(path.join(C_folder, 'images'));
    const metadata = readdirSync(path.join(C_folder, 'metadata'));
    console.log(`随机重组：`, images.length, metadata.length)

    shuffleAndRenameFiles(images, metadata, C_folder);
    // const shuffledMetadata = shuffleArray(metadata);
};

combineAndShuffleFolders();