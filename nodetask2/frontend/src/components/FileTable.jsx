import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUploadForm from './FileUploadForm';
import Modal from './Modal';
import './FileTable.css';

const FileTable = () => {
    const [files, setFiles] = useState([]);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [editingFile, setEditingFile] = useState(null);

    const API_BASE_URL = 'http://localhost:3000';
    const PLACEHOLDER_IMAGE = 'https://www.dummyimg.in/placeholder';

    const getImageUrl = (file) => {
    
        const imgPath = typeof file.img === 'object' ? file.img.path : file.img;
        
        if (!imgPath) {
            return `${API_BASE_URL}/uploads/${file.filename}`;
        }
        return `${API_BASE_URL}/${imgPath}`;
    };

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/files');
                console.log('Files received:', response.data);
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };

        fetchFiles();
    }, []);

    const handleDelete = async (file) => {
        if (window.confirm(`Are you sure you want to delete ${file.name}?`)) {
            try {
                await axios.delete(`http://localhost:3000/api/files/${file.id}`);
                setFiles(files.filter(f => f.id !== file.id));
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }
    };

    const handleEdit = (file) => {
        setEditingFile(file);
        setShowUploadForm(false);
    };

    const handleFileUploaded = (newFile) => {
        setFiles([...files, newFile]);
        setShowUploadForm(false);
    };

    const handleFileUpdated = (updatedFile) => {
        setFiles(files.map(file =>
            file.id === updatedFile.id ? updatedFile : file
        ));
        setEditingFile(null);
    };

    const handleCloseModal = () => {
        setShowUploadForm(false);
        setEditingFile(null);
    };

    return (
        <div className="file-manager">
            <div className="table-container">
                <div className="table-header">
                    <button
                        className="add-file-btn"
                        onClick={() => setShowUploadForm(true)}
                    >
                        Add New File
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th className="col-preview">Preview</th>
                            <th className="col-name">Name</th>
                            <th className="col-filename">Filename</th>
                            <th className="col-upload-date">Upload Date</th>
                            <th className="col-modified-date">Modified Date</th>
                            <th className="col-actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file) => (
                            <tr key={file.id}>
                                <td className="col-preview preview-cell">
                                    <img
                                        className="thumbnail"
                                        src={getImageUrl(file)}
                                        alt={file.name}
                                        onError={(e) => {
                                            console.log('Image failed to load:', getImageUrl(file)); // Debug log
                                            e.target.src = PLACEHOLDER_IMAGE;
                                            e.target.onerror = null;
                                        }}
                                    />
                                </td>
                                <td className="col-name">{file.name}</td>
                                <td className="col-filename">{file.filename}</td>
                                <td className="col-upload-date">{new Date(file.uploaded_at).toLocaleDateString()}</td>
                                <td className="col-modified-date">{new Date(file.modified_at).toLocaleDateString()}</td>
                                <td className="col-actions">
                                    <div className="action-buttons">
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(file)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(file)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={showUploadForm || editingFile !== null}
                onClose={handleCloseModal}
            >
                <FileUploadForm
                    file={editingFile}
                    isEditing={editingFile !== null}
                    onFileUploaded={editingFile ? handleFileUpdated : handleFileUploaded}
                    onClose={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default FileTable;
