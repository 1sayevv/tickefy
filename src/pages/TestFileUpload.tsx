import { useState } from 'react'
import { uploadImageToVercel } from '@/lib/vercelStorage'
import { useToast } from '@/contexts/ToastContext'

export default function TestFileUpload() {
  const { showSuccess, showError } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check if it's an image
    if (!selectedFile.type.startsWith('image/')) {
      showError('Invalid File', 'Please select an image file')
      return
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      showError('File Too Large', 'File size should not exceed 5MB')
      return
    }

    setFile(selectedFile)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImageToVercel(file)
      setUploadedUrl(url)
      showSuccess('Success!', 'File uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      showError('Upload Failed', 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">File Upload Test</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {preview && (
          <div>
            <label className="block text-sm font-medium mb-2">Preview</label>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded border"
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        {uploadedUrl && (
          <div>
            <label className="block text-sm font-medium mb-2">Uploaded URL</label>
            <input
              type="text"
              value={uploadedUrl}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-50"
            />
          </div>
        )}
      </div>
    </div>
  )
} 