import React, { useState, useEffect } from 'react';
import api from '../api';
import { useToast } from '../components/ToastProvider';
import { marked } from 'marked';
import Modal from '../components/Modal';
import Loader from '../components/Loader';

const FilesTab = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [allFolders, setAllFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [operationMessage, setOperationMessage] = useState('');
  const [editingFile, setEditingFile] = useState(null);
  const [viewingFile, setViewingFile] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [newFile, setNewFile] = useState({ title: '', content: '', folder: null });
  const [newFolderName, setNewFolderName] = useState('');
  const [pinningFiles, setPinningFiles] = useState(() => new Set());
  const [pinningFolders, setPinningFolders] = useState(() => new Set());
  const { addToast } = useToast();

  // Formatting state for rich text editor
  const [formatMenu, setFormatMenu] = useState(false);

  useEffect(() => {
    fetchAllFolders();
    fetchFolders();
    fetchFiles();
  }, [currentFolder]);

  const fetchAllFolders = async () => {
    try {
      setLoading(true);
      // Fetch all folders without parent filter for dropdown
      const response = await api.get('/api/folders');
      setAllFolders(response.data);
    } catch (error) {
      addToast('error', 'Failed to load all folders');
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const params = currentFolder ? { parentFolder: currentFolder } : {};
      const response = await api.get('/api/folders', { params });
      // Sort: pinned folders first, then by createdAt
      const sorted = response.data.sort((a, b) => {
        if (a.isPinned === b.isPinned) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return b.isPinned ? 1 : -1;
      });
      setFolders(sorted);
    } catch (error) {
      addToast('error', 'Failed to load folders');
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const params = { folder: currentFolder || 'null' };
      const response = await api.get('/api/files', { params });
      // Sort: pinned files first, then by updatedAt
      const sorted = response.data.sort((a, b) => {
        if (a.isPinned === b.isPinned) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        }
        return b.isPinned ? 1 : -1;
      });
      setFiles(sorted);
    } catch (error) {
      addToast('error', 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFile = async () => {
    if (!newFile.title.trim()) {
      addToast('error', 'Please enter a file title');
      return;
    }

    if (newFile.title.length > 200) {
      addToast('error', 'Title must be 200 characters or less');
      return;
    }

    if (newFile.content.length > 50000) {
      addToast('error', 'Content must be 50,000 characters or less');
      return;
    }

    try {
      setOperationLoading(true);
      setOperationMessage('Creating your file...');
      const fileData = { ...newFile, folder: newFile.folder || null };
      await api.post('/api/files', fileData);
      addToast('success', 'File created successfully');
      setShowCreateModal(false);
      setNewFile({ title: '', content: '', folder: null });
      fetchFiles();
      fetchAllFolders();
    } catch (error) {
      addToast('error', error.response?.data?.message || 'Failed to create file');
    } finally {
      setOperationLoading(false);
      setOperationMessage('');
    }
  };

  const handleUpdateFile = async (id, updates) => {
    if (updates.title && updates.title.length > 200) {
      addToast('error', 'Title must be 200 characters or less');
      return;
    }

    if (updates.content && updates.content.length > 50000) {
      addToast('error', 'Content must be 50,000 characters or less');
      return;
    }

    try {
      setOperationLoading(true);
      setOperationMessage('Updating your file...');
      await api.put(`/api/files/${id}`, updates);
      addToast('success', 'File updated successfully');
      setEditingFile(null);
      setViewingFile(updates);
      fetchFiles();
      fetchAllFolders();
    } catch (error) {
      addToast('error', error.response?.data?.message || 'Failed to update file');
    } finally {
      setOperationLoading(false);
      setOperationMessage('');
    }
  };

  const handleDeleteFile = async (id) => {
    try {
      setOperationLoading(true);
      setOperationMessage('Deleting your file...');
      await api.delete(`/api/files/${id}`);
      addToast('success', 'File deleted successfully');
      setViewingFile(null);
      setShowDeleteModal(false);
      fetchFiles();
    } catch (error) {
      addToast('error', 'Failed to delete file');
    } finally {
      setOperationLoading(false);
      setOperationMessage('');
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      addToast('error', 'Please enter a folder name');
      return;
    }

    if (newFolderName.length > 100) {
      addToast('error', 'Folder name must be 100 characters or less');
      return;
    }

    try {
      setOperationLoading(true);
      setOperationMessage('Creating folder...');
      await api.post('/api/folders', { name: newFolderName, parentFolder: currentFolder });
      addToast('success', 'Folder created successfully');
      setShowCreateFolderModal(false);
      setNewFolderName('');
      fetchFolders();
    } catch (error) {
      addToast('error', error.response?.data?.message || 'Failed to create folder');
    } finally {
      setOperationLoading(false);
      setOperationMessage('');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      setOperationLoading(true);
      setOperationMessage('Deleting folder...');
      await api.delete(`/api/folders/${folderId}`);
      addToast('success', 'Folder deleted successfully');
      setShowDeleteFolderModal(false);
      setFolderToDelete(null);
      fetchFolders();
      fetchAllFolders();
    } catch (error) {
      addToast('error', error.response?.data?.message || 'Failed to delete folder');
    } finally {
      setOperationLoading(false);
      setOperationMessage('');
    }
  };

  const openFolder = async (folderId, folderName) => {
    setCurrentFolder(folderId);
    setFolderPath([...folderPath, { id: folderId, name: folderName }]);
  };

  const navigateToFolder = (index) => {
    if (index === -1) {
      // Navigate to root
      setCurrentFolder(null);
      setFolderPath([]);
    } else {
      const folder = folderPath[index];
      setCurrentFolder(folder.id);
      setFolderPath(folderPath.slice(0, index + 1));
    }
  };

  const handleToggleFolderPin = async (id) => {
    if (pinningFolders.has(id)) return;

    setPinningFolders((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    try {
      await api.patch(`/api/folders/${id}/pin`);
      // Update local state immediately and reorder
      setFolders((prev) => {
        const updated = prev.map(f => f._id === id ? { ...f, isPinned: !f.isPinned } : f);
        // Sort: pinned folders first, then by createdAt
        return updated.sort((a, b) => {
          if (a.isPinned === b.isPinned) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return b.isPinned ? 1 : -1;
        });
      });
    } catch (error) {
      addToast('error', 'Failed to toggle folder pin');
    } finally {
      setPinningFolders((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleTogglePin = async (id) => {
    if (pinningFiles.has(id)) return;

    setPinningFiles((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    try {
      await api.patch(`/api/files/${id}/pin`);
      // Update local state immediately and reorder
      setFiles((prev) => {
        const updated = prev.map(f => f._id === id ? { ...f, isPinned: !f.isPinned } : f);
        // Sort: pinned files first, then by updatedAt
        return updated.sort((a, b) => {
          if (a.isPinned === b.isPinned) {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          }
          return b.isPinned ? 1 : -1;
        });
      });
    } catch (error) {
      addToast('error', 'Failed to toggle pin');
    } finally {
      setPinningFiles((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // Rich text formatting functions
  const insertFormatting = (textarea, before, after = '') => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    
    return { newText, cursorPos: start + before.length + selectedText.length + after.length };
  };

  const applyFormat = (format, file, isEditing = false) => {
    const textarea = document.getElementById(isEditing ? 'edit-content' : 'create-content');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let before = '', after = '';
    
    switch(format) {
      case 'h1': before = '# '; break;
      case 'h2': before = '## '; break;
      case 'h3': before = '### '; break;
      case 'bold': before = '**'; after = '**'; break;
      case 'italic': before = '_'; after = '_'; break;
      case 'code': before = '`'; after = '`'; break;
      case 'codeblock': before = '```\n'; after = '\n```'; break;
      case 'link': before = '['; after = '](url)'; break;
      case 'list': before = '- '; break;
      case 'numlist': before = '1. '; break;
      case 'quote': before = '> '; break;
      case 'hr': before = '\n---\n'; break;
      case 'table':
        before = '\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n';
        break;
    }

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    const cursorPos = start + before.length + selectedText.length + after.length;
    
    if (isEditing) {
      setEditingFile({ ...editingFile, content: newText });
    } else {
      setNewFile({ ...newFile, content: newText });
    }
    
    setTimeout(() => {
      textarea.value = newText;
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  if (loading) {
    return <Loader message='Loading Your Files & Folders...'/>;
  }

  if (operationLoading) {
    return <Loader message={operationMessage}/>;
  }

  return (
    <div className="files-tab">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">My Files</h2>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary"
            onClick={() => setShowCreateFolderModal(true)}
          >
            <i className="ri-folder-add-line me-2"></i>New Folder
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="ri-add-line me-2"></i>New File
          </button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      {folderPath.length > 0 && (
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#" onClick={(e) => { e.preventDefault(); navigateToFolder(-1); }}>
                <i className="ri-home-line me-1"></i>Root
              </a>
            </li>
            {folderPath.map((folder, index) => (
              <li 
                key={folder.id} 
                className={`breadcrumb-item ${index === folderPath.length - 1 ? 'active' : ''}`}
              >
                {index === folderPath.length - 1 ? (
                  folder.name
                ) : (
                  <a href="#" onClick={(e) => { e.preventDefault(); navigateToFolder(index); }}>
                    {folder.name}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Folders List */}
      { files.length === 0 && folders.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="ri-file-line" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3">No files or folders yet. Create your first one!</p>
        </div>
      ) : folders.length > 0 ? (
        <div className="mb-4">
          <h5 className="mb-3">Folders</h5>
          <div className="row g-3">
            {folders.map((folder) => (
              <div key={folder._id} className="col-md-3 col-sm-6">
                <div className="card folder-card h-100">
                  <div className="card-body" onClick={() => openFolder(folder._id, folder.name)} style={{ cursor: 'pointer' }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <i className="ri-folder-fill text-warning" style={{ fontSize: '2rem' }}></i>
                      <div className="d-flex gap-1">
                        <button
                          className="file-pin-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFolderPin(folder._id);
                          }}
                          disabled={pinningFolders.has(folder._id)}
                          title={folder.isPinned ? 'Unpin folder' : 'Pin folder'}
                        >
                          {pinningFolders.has(folder._id) ? (
                            <div className="spinner-border spinner-border-sm" role="status" />
                          ) : (
                            <i className={folder.isPinned ? 'ri-pushpin-fill' : 'ri-pushpin-line'}></i>
                          )}
                        </button>
                        <button
                          className="file-pin-btn text-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFolderToDelete(folder);
                            setShowDeleteFolderModal(true);
                          }}
                          title="Delete folder"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </div>
                    <h6 className="mt-2 mb-0">{folder.name}</h6>
                    <small className="text-muted">
                      {new Date(folder.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Files List */}
      {files.length === 0 && folders.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="ri-file-line" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3">No files or folders yet. Create your first one!</p>
        </div>
      ) : files.length > 0 ? (
        <div>
          <h5 className="mb-3">Files</h5>
          <div className="row g-3">
          {files.map(file => (
            <div key={file._id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 file-card" onClick={() => setViewingFile(file)}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0 file-title-truncate">{file.title}</h5>
                    <div className="d-flex gap-1">
                      <button
                        className="file-pin-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePin(file._id);
                        }}
                        disabled={pinningFiles.has(file._id)}
                        title={file.isPinned ? 'Unpin file' : 'Pin file'}
                      >
                        {pinningFiles.has(file._id) ? (
                          <div className="spinner-border spinner-border-sm" role="status" />
                        ) : (
                          <i className={file.isPinned ? 'ri-pushpin-fill' : 'ri-pushpin-line'}></i>
                        )}
                      </button>
                      <button
                        className="file-pin-btn text-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingFile(file);
                          setShowDeleteModal(true);
                        }}
                        title="Delete file"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                  <p className="card-text text-muted small file-preview-text">
                    {file.content.replace(/[#*`>\-\[\]]/g, '').substring(0, 100)}{file.content.length > 100 ? '...' : ''}
                  </p>
                  <div className="text-muted small">
                    {new Date(file.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      ) : null}

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div 
          className="modal show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(31, 35, 40, 0.18)', backdropFilter: 'blur(1px)' }}
          onClick={() => {
            setShowCreateFolderModal(false);
            setNewFolderName('');
          }}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Create New Folder</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowCreateFolderModal(false);
                  setNewFolderName('');
                }}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Folder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter folder name (max 100 characters)"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    maxLength={100}
                  />
                  <small className="text-muted">{newFolderName.length}/100</small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowCreateFolderModal(false);
                  setNewFolderName('');
                }} disabled={operationLoading}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleCreateFolder} disabled={operationLoading}>
                  {operationLoading ? 'Creating...' : 'Create Folder'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create File Modal */}
      {showCreateModal && (
        <div 
          className="modal show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(31, 35, 40, 0.18)', backdropFilter: 'blur(1px)' }}
          onClick={() => {
            setShowCreateModal(false);
            setNewFile({ title: '', content: '', folder: null });
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Create New File</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowCreateModal(false);
                  setNewFile({ title: '', content: '', folder: null });
                }}></button>
              </div>
              <div className="modal-body">
        <div>
                <div className="mb-3">
                  <label className="form-label">Folder (Optional)</label>
                  <select
                    className="form-select"
                    value={newFile.folder || ''}
                    onChange={(e) => setNewFile({ ...newFile, folder: e.target.value || null })}
                  >
                    <option value="">Root (No Folder)</option>
                    {allFolders.map(folder => (
                      <option key={folder._id} value={folder._id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter file title (max 200 characters)"
                    value={newFile.title}
                    onChange={(e) => setNewFile({ ...newFile, title: e.target.value })}
                    maxLength={200}
                  />
                  <small className="text-muted">{newFile.title.length}/200</small>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Content</label>
                  
                  {/* Rich Text Toolbar */}
                  <div className="toolbar mb-2 p-2 border rounded">
                    <div className="btn-group btn-group-sm me-2">
                      <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('h1', newFile)} title="Heading 1">
                        <i className="ri-h-1"></i>
                      </button>
                      <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('h2', newFile)} title="Heading 2">
                        <i className="ri-h-2"></i>
                      </button>
                      <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('h3', newFile)} title="Heading 3">
                        <i className="ri-h-3"></i>
                      </button>
                    </div>
                    
                    <div className="btn-group btn-group-sm me-2">
                      <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('bold', newFile)} title="Bold">
                        <i className="ri-bold"></i>
                      </button>
                      <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('italic', newFile)} title="Italic">
                        <i className="ri-italic"></i>
                      </button>
                    </div>
                    
                    <div className="btn-group btn-group-sm me-2">
                      <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('list', newFile)} title="Bullet List">
                        <i className="ri-list-unordered"></i>
                      </button>
                      <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('numlist', newFile)} title="Numbered List">
                        <i className="ri-list-ordered"></i>
                      </button>
                    </div>
                    
                    <div className="btn-group btn-group-sm me-2">
                      <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('code', newFile)} title="Inline Code">
                        <i className="ri-code-line"></i>
                      </button>
                      <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('codeblock', newFile)} title="Code Block">
                        <i className="ri-code-box-line"></i>
                      </button>
                    </div>
                    
                    <div className="btn-group btn-group-sm me-2">
                      <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('link', newFile)} title="Link">
                        <i className="ri-link"></i>
                      </button>
                      <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('quote', newFile)} title="Quote">
                        <i className="ri-double-quotes-l"></i>
                      </button>
                      <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('table', newFile)} title="Table">
                        <i className="ri-table-line"></i>
                      </button>
                      <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('hr', newFile)} title="Horizontal Rule">
                        <i className="ri-separator"></i>
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    id="create-content"
                    className="form-control"
                    rows="15"
                    placeholder="Write your content here using markdown formatting..."
                    value={newFile.content}
                    onChange={(e) => setNewFile({ ...newFile, content: e.target.value })}
                    maxLength={50000}
                  ></textarea>
                  <small className="text-muted">{newFile.content.length}/50,000</small>
                </div>
        </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowCreateModal(false);
                  setNewFile({ title: '', content: '', folder: null });
                }} disabled={operationLoading}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleCreateFile} disabled={operationLoading}>
                  {operationLoading ? 'Creating...' : 'Create File'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit File Modal */}
      {viewingFile && (
        <div 
          className="modal show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(31, 35, 40, 0.18)', backdropFilter: 'blur(1px)' }}
          onClick={() => {
            setViewingFile(null);
            setEditingFile(null);
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                {editingFile ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editingFile.title}
                    onChange={(e) => setEditingFile({ ...editingFile, title: e.target.value })}
                    maxLength={200}
                  />
                ) : (
                  <h5 className="modal-title">{viewingFile.title}</h5>
                )}
                <button type="button" className="btn-close" onClick={() => {
                  setViewingFile(null);
                  setEditingFile(null);
                }}></button>
              </div>
              <div className="modal-body">
        {viewingFile && (
          <div>
                {editingFile ? (
                  <>
                    {/* Folder Selection for Editing */}
                    <div className="mb-3">
                      <label className="form-label">Folder (Optional)</label>
                      <select
                        className="form-select"
                        value={editingFile.folder || ''}
                        onChange={(e) => setEditingFile({ ...editingFile, folder: e.target.value || null })}
                      >
                        <option value="">Root (No Folder)</option>
                        {allFolders.map(folder => (
                          <option key={folder._id} value={folder._id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Rich Text Toolbar for Editing */}
                    <div className="toolbar mb-2 p-2 border rounded">
                      <div className="btn-group btn-group-sm me-2">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('h1', editingFile, true)} title="Heading 1">
                          <i className="ri-h-1"></i>
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('h2', editingFile, true)} title="Heading 2">
                          <i className="ri-h-2"></i>
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('h3', editingFile, true)} title="Heading 3">
                          <i className="ri-h-3"></i>
                        </button>
                      </div>
                      
                      <div className="btn-group btn-group-sm me-2">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('bold', editingFile, true)} title="Bold">
                          <i className="ri-bold"></i>
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('italic', editingFile, true)} title="Italic">
                          <i className="ri-italic"></i>
                        </button>
                      </div>
                      
                      <div className="btn-group btn-group-sm me-2">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('list', editingFile, true)} title="Bullet List">
                          <i className="ri-list-unordered"></i>
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('numlist', editingFile, true)} title="Numbered List">
                          <i className="ri-list-ordered"></i>
                        </button>
                      </div>
                      
                      <div className="btn-group btn-group-sm me-2">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('code', editingFile, true)} title="Inline Code">
                          <i className="ri-code-line"></i>
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('codeblock', editingFile, true)} title="Code Block">
                          <i className="ri-code-box-line"></i>
                        </button>
                      </div>
                      
                      <div className="btn-group btn-group-sm me-2">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('link', editingFile, true)} title="Link">
                          <i className="ri-link"></i>
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('quote', editingFile, true)} title="Quote">
                          <i className="ri-double-quotes-l"></i>
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('table', editingFile, true)} title="Table">
                          <i className="ri-table-line"></i>
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => applyFormat('hr', editingFile, true)} title="Horizontal Rule">
                          <i className="ri-separator"></i>
                        </button>
                      </div>
                    </div>
                    
                    <textarea
                      id="edit-content"
                      className="form-control"
                      rows="15"
                      value={editingFile.content}
                      onChange={(e) => setEditingFile({ ...editingFile, content: e.target.value })}
                      maxLength={50000}
                    ></textarea>
                    <small className="text-muted">{editingFile.content.length}/50,000</small>
                  </>
                ) : (
                  <div className="file-content">
                    <div 
                      className="markdown-preview"
                      dangerouslySetInnerHTML={{ __html: marked(viewingFile.content) }}
                    />
                  </div>
                )}
          </div>
        )}
              </div>
              <div className="modal-footer">
                {editingFile ? (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingFile(null)} disabled={operationLoading}>
                      <i className="ri-close-line"></i> Cancel
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => handleUpdateFile(editingFile._id, editingFile)} disabled={operationLoading}>
                      <i className="ri-save-line"></i> {operationLoading ? 'Saving...' : 'Save'}
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn btn-danger" onClick={() => setShowDeleteModal(true)} disabled={operationLoading}>
                      <i className="ri-delete-bin-line"></i> Delete
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => setEditingFile({ ...viewingFile })} disabled={operationLoading}>
                      <i className="ri-edit-line"></i> Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete File?"
        footer={
          <div className="d-flex gap-2 justify-content-end w-100">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setShowDeleteModal(false)}
              disabled={operationLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => handleDeleteFile(viewingFile._id)}
              disabled={operationLoading}
            >
              {operationLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        }
      >
        <p className="mb-0">Are you sure you want to delete "{viewingFile?.title}"? This action cannot be undone.</p>
      </Modal>

      {/* Delete Folder Confirmation Modal */}
      <Modal
        open={showDeleteFolderModal}
        onClose={() => {
          setShowDeleteFolderModal(false);
          setFolderToDelete(null);
        }}
        title="Delete Folder?"
        footer={
          <div className="d-flex gap-2 justify-content-end w-100">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => {
                setShowDeleteFolderModal(false);
                setFolderToDelete(null);
              }}
              disabled={operationLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => handleDeleteFolder(folderToDelete._id)}
              disabled={operationLoading}
            >
              {operationLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        }
      >
        <p className="mb-0">Are you sure you want to delete folder "{folderToDelete?.name}"?</p>
        <p className="mb-0 text-warning"><small>Note: Folder must be empty (no files or subfolders) to be deleted.</small></p>
      </Modal>
    </div>
  );
};

export default FilesTab;
