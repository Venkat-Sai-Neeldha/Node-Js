const db = require('../models');
const File = db.File;
const multer = require('multer');
const path = require('path');
const HttpStatus = require('../constants/httpStatus');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) 
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 
    },
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).single('img'); 

// Create and Save a new File
exports.create = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(HttpStatus.BAD_REQUEST.code).json({
                message: err.message
            });
        }

        try {
            if (!req.file || !req.body.name) {
                return res.status(HttpStatus.BAD_REQUEST.code).json({
                    message: "Name and image file cannot be empty!"
                });
            }

            const imgPath = 'uploads/' + req.file.filename;
            
            const file = await File.create({
                name: req.body.name,
                filename: req.file.filename,
                img: imgPath  // Store as string path
            });

            const responseFile = {
                id: file.id,
                name: file.name,
                filename: file.filename,
                img: imgPath,
                uploaded_at: file.uploaded_at,
                modified_at: file.modified_at
            };

            res.status(HttpStatus.CREATED.code).json(responseFile);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
                message: error.message || "Some error occurred while creating the file."
            });
        }
    });
};


exports.findAll = async (req, res) => {
    try {
        const files = await File.findAll({
            attributes: ['id', 'name', 'filename', 'img', 'uploaded_at', 'modified_at']
        });

    
        const formattedFiles = files.map(file => ({
            ...file.toJSON(),
            img: typeof file.img === 'object' ? file.img.path : file.img
        }));

        res.status(HttpStatus.OK.code).json(formattedFiles);
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
            message: error.message || "Some error occurred while retrieving files."
        });
    }
};


exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const file = await File.findByPk(id);
        if (file) {
            res.status(HttpStatus.OK.code).json(file);
        } else {
            res.status(HttpStatus.NOT_FOUND.code).json({
                message: `File with id=${id} not found`
            });
        }
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
            message: error.message || "Error retrieving file with id=" + id
        });
    }
};

// Update a File by the id
exports.update = async (req, res) => {
    const id = req.params.id;

    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(HttpStatus.BAD_REQUEST.code).json({
                message: "File upload error: " + err.message
            });
        } else if (err) {
            return res.status(HttpStatus.BAD_REQUEST.code).json({
                message: err.message
            });
        }

        try {
            const updateData = {
                modified_at: new Date()
            };

            if (req.body.name) {
                updateData.name = req.body.name;
            }

            if (req.file) {
                updateData.filename = req.file.filename;
                updateData.img = 'uploads/' + req.file.filename; 
            }

            const [num] = await File.update(updateData, {
                where: { id: id }
            });

            if (num === 1) {
                
                res.status(HttpStatus.OK.code).json({
                    message: "File was updated successfully.",
                    img: req.file ? updateData.img : undefined
                });
            } else {
                res.status(HttpStatus.NOT_FOUND.code).json({
                    message: `Cannot update File with id=${id}. Maybe File was not found!`
                });
            }
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
                message: error.message || "Error updating File with id=" + id
            });
        }
    });
};

// Delete a File with the specified id
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        const file = await File.findByPk(id);
        if (!file) {
            return res.status(HttpStatus.NOT_FOUND.code).json({
                message: `Cannot delete File with id=${id}. Maybe File was not found!`
            });
        }

        // Delete the file from storage
        const fs = require('fs').promises;
        try {
            await fs.unlink(file.img);
        } catch (fsError) {
            console.warn(`Physical file not found: ${file.img}`);
            
        }

        // Delete the database record
        await file.destroy();

        res.status(HttpStatus.OK.code).json({
            message: "File was deleted successfully!"
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
            message: error.message || "Could not delete File with id=" + id
        });
    }
};


