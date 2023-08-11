import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import AdmZip from 'adm-zip';

const app = express();
const PORT = 3000;

// Set up Multer storage configuration
const storage = multer.memoryStorage(); // Store file in memory for processing
const upload = multer({ storage: storage });

// create unzipped folder if not present
const unzippedPath = path.join(__dirname, 'unzipped');
fs.ensureDirSync(unzippedPath);

// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
    if (req.file) {
        try {
            const uploadedFileBuffer = req.file.buffer;
            const zip = new AdmZip(uploadedFileBuffer);

            // Extract the zip contents to the unzipped folder
            zip.extractAllTo(unzippedPath, true);

            // Rename the extracted folder with a timestamp
            const timestamp = new Date().toISOString().replace(/:/g, '-');
            const extractedFolderName = path.basename(req.file.originalname, path.extname(req.file.originalname));
            const renamedFolderName = `${extractedFolderName}_${timestamp}`;
            const extractedFolderPath = path.join(unzippedPath, extractedFolderName);
            const renamedFolderPath = path.join(unzippedPath, renamedFolderName);
            await fs.promises.unlink(req.file.path);
            await fs.promises.rename(extractedFolderPath, renamedFolderPath);
            // Remove the uploaded file

            res.status(200).send('Zip file extracted and renamed successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred during extraction');
        }
    } else {
        res.status(500).send('No file present');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
