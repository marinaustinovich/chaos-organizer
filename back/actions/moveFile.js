
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

async function moveFile(file, type) {
    const uploadDir = path.join(__dirname, 'public', type);
    await fsp.mkdir(uploadDir, { recursive: true });

    const newFilename = `${Date.now()}-${file.originalFilename}`;
    const savePath = path.join(uploadDir, newFilename);

    try {
        await fsp.rename(file.filepath, savePath);
    } catch (error) {
        if (error.code === 'EXDEV') {
            await fsp.copyFile(file.filepath, savePath);
            await fsp.unlink(file.filepath);
        } else {
            throw error;
        }
    }

    return path.join(type, newFilename).replace(/\\/g, '/');
}

async function copyFile(src, dest) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(src);
        const writeStream = fs.createWriteStream(dest);

        readStream.on('data', (chunk) => console.log(`Read ${chunk.length} bytes`));
        writeStream.on('drain', () => console.log('Write stream drained'));

        readStream.on('end', () => {
            writeStream.end(); 
        });
        readStream.on('error', (error) => {
            console.error('Read stream error:', error);
            reject(error);
        });
        writeStream.on('error', (error) => {
            console.error('Write stream error:', error);
            reject(error);
        });
        writeStream.on('close', () => {
            resolve();
        });

        readStream.pipe(writeStream);
    });
}

module.exports = moveFile;
