import nextConnect from 'next-connect';
import multer from 'multer';
import cloudinary from '@/utils/cloudinary';



const upload = multer({ storage: multer.memoryStorage() });

const apiRoute = nextConnect();

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'profile_images' },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            stream.end(req.file.buffer);
        });

        res.status(200).json({ url: result.secure_url });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false,
    },
};