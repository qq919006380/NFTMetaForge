import fs from "fs/promises";
import path from "path";
import { Sema } from "async-sema";

const folderPath = "./main/metadata";
const prefix = "ipfs://QmU7bxeDCxyFNasUG6YkKS2wy1H3iH74MfEEopWBjspRth/";
const concurrencyLimit = 10; // 同时处理的文件数量

const semaphore = new Sema(concurrencyLimit);

async function processFile(file: string) {
  try {
    const filePath = path.join(folderPath, file);
    const data = await fs.readFile(filePath, "utf8");
    const jsonContent = JSON.parse(data) as { image: string };

    if (jsonContent.image && typeof jsonContent.image === "string") {
      jsonContent.image = prefix + jsonContent.image;
      // jsonContent.image=jsonContent.image.replace(prefix,'')
      const updatedData = JSON.stringify(jsonContent, null, 2);

      await fs.writeFile(filePath, updatedData, "utf8");
      console.log(`已更新文件 ${file}`);
    } else {
      console.log(`文件 ${file} 不包含合适的 image 字段`);
    }
  } catch (error) {
    console.error(`处理文件 ${file} 失败：`, error);
  } finally {
    semaphore.release();
  }
}

async function processFiles() {
  try {
    const files = await fs.readdir(folderPath);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const promises = jsonFiles.map(async (file) => {
      await semaphore.acquire();
      return processFile(file);
    });

    // 使用 Promise.allSettled 来捕获所有 Promise 的结果
    const results = await Promise.allSettled(promises);
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`处理文件 ${jsonFiles[index]} 失败：`, result.reason);
      }
    });
  } catch (error) {
    console.error("读取文件夹失败：", error);
  }
}

processFiles();