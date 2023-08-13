import fs from "fs";

const numberOfFiles = 3;//生成的数量
const outputFolder = "output/genJson"; //输出目录

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

for (let i = 1; i <= numberOfFiles; i++) {
  const jsonContent = {
    name: `Blindbox #${i}`,
    image: "ipfs://QmVvaP7QcqygRYysUkgcSMrQwLqGe4rCE31757mNbj4Gtz/BlindBox.gif",
    description: "Mysterious Rolling Gears",
    attributes: [
      {
        type: "Gear",
        value: "What's your destiny?",
      },
    ],
  };
  const fileName = `${outputFolder}/${i}.json`;

  fs.writeFileSync(fileName, JSON.stringify(jsonContent, null, 2));
}

console.log(
  `Created ${numberOfFiles} JSON files in the ${outputFolder} folder.`
);
