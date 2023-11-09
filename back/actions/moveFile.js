
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function moveFile(file, type) {
    const serverDir = path.join(__dirname, '..'); 
    const uploadDir = path.join(serverDir, 'public', type);
    await fsp.mkdir(uploadDir, { recursive: true });

    const newFilename = `${uuidv4()}-${file.originalFilename}`;
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

module.exports = moveFile;
