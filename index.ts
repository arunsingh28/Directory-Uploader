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

// Create the 'unzipped' folder if it doesn't exist
const unzippedPath = path.join(__dirname, 'unzipped');
fs.ensureDirSync(unzippedPath);

// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
    if (req.file) {
        try {
            const uploadedFileBuffer = req.file.buffer;
            const zip = new AdmZip(uploadedFileBuffer);

            // Extract the zip contents to the 'unzipped' folder
            zip.extractAllTo(unzippedPath, true);

            // Get the extracted folder's name and path
            const extractedFolderName = path.basename(req.file.originalname, path.extname(req.file.originalname));
            const extractedFolderPath = path.join(unzippedPath, extractedFolderName);

            // Check if the extracted folder exists before renaming
            if (fs.existsSync(extractedFolderPath)) {
                // Rename the extracted folder with a timestamp
                const timestamp = new Date().toISOString().replace(/:/g, '-');
                const renamedFolderName = `${extractedFolderName}_${timestamp}`;
                const renamedFolderPath = path.join(unzippedPath, renamedFolderName);

                // Rename the extracted folder
                fs.renameSync(extractedFolderPath, renamedFolderPath);

                // Remove the uploaded zip file
                fs.unlinkSync(req.file.path);
            } else {
                console.error('Extracted folder not found');
            }

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
