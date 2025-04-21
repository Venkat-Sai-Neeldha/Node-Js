import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FileUploadForm.css';

const FileUploadForm = ({ file, isEditing, onFileUploaded, onClose }) => {
    const [name, setName] = useState('');
    const [newFile, setNewFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentFileName, setCurrentFileName] = useState('');

    useEffect(() => {
        if (file && isEditing) {
            setName(file.name || '');
            setCurrentFileName(file.filename || '');
        } else {
            setName('');
            setNewFile(null);
            setCurrentFileName('');
        }
    }, [file, isEditing]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setNewFile(selectedFile);
        if (selectedFile) {
            setCurrentFileName(selectedFile.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name || (!newFile && !isEditing)) {
            setError('Please provide both name and file');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        if (newFile) {
            formData.append('img', newFile);
        }

        try {
            setLoading(true);
            setError(null);
            
            let response;
            if (isEditing) {
                response = await axios.put(`http://localhost:3000/api/files/${file.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const updatedFile = {
                    ...file,
                    name: name,
                    modified_at: new Date().toISOString()
                };
                if (newFile) {
                    updatedFile.filename = newFile.name;
                    updatedFile.img = response.data.img || updatedFile.img;
                }
                onFileUploaded(updatedFile);
            } else {
                response = await axios.post('http://localhost:3000/api/files', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                onFileUploaded(response.data);
            }

            setName('');
            setNewFile(null);
            onClose();
        } catch (err) {
            console.error('Error uploading file:', err);
            setError(err.message || `Error ${isEditing ? 'updating' : 'uploading'} file`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="upload-form">
            <h3>{isEditing ? 'Edit File' : 'Upload New File'}</h3>

            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter file name"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="file">File:</label>
                {isEditing && (
                    <div className="current-file">
                        <p>Current file: {currentFileName}</p>
                        <img 
                            src={`http://localhost:3000/${file.img}`}
                            alt="Current file"
                            className="current-file-preview"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150';
                            }}
                        />
                    </div>
                )}
                <input
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!isEditing}
                />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
                <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : (isEditing ? 'Update' : 'Upload')}
                </button>
                <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default FileUploadForm;





