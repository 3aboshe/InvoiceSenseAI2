"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, Image as ImageIcon, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { useSocket } from "@/hooks/useSocket"

interface FileWithPreview extends File {
  preview: string
}

interface UploadResult {
  success: boolean
  data?: any
  error?: string
}

export default function ImageUploader() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [results, setResults] = useState<UploadResult[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreview = acceptedFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    )
    setFiles(filesWithPreview)
    setResults([])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf']
    },
    maxSize: 15 * 1024 * 1024, // 15MB
    multiple: true
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setResults(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload")
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setResults([])

    try {
      const uploadResults: UploadResult[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setUploadProgress(((i + 1) / files.length) * 100)
        
        const formData = new FormData()
        formData.append("file", file)
        
        const response = await fetch("/api/process-invoice", {
          method: "POST",
          body: formData
        })
        
        const result = await response.json()
        
        if (result.success) {
          uploadResults.push({
            success: true,
            data: result.data
          })
          toast.success(`${file.name} processed successfully!`)
        } else {
          uploadResults.push({
            success: false,
            error: result.error || "Processing failed"
          })
          toast.error(`${file.name} failed to process`)
        }
      }
      
      setResults(uploadResults)
      
      // Clear files after successful upload
      setTimeout(() => {
        setFiles([])
        setUploadProgress(0)
      }, 2000)
      
    } catch (error) {
      toast.error("Failed to process files")
      setResults(files.map(() => ({
        success: false,
        error: "Processing failed"
      })))
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="premium-card">
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/30'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-lg text-blue-400">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg text-slate-300 mb-2">
                  Drag & drop invoice files here
                </p>
                <p className="text-sm text-slate-400 mb-4">
                  Supports images (JPEG, PNG, GIF) and PDF files up to 15MB
                </p>
                <Button variant="outline" className="glass-button">
                  Browse Files
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card className="premium-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Selected Files</h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="w-5 h-5 text-blue-400" />
                    ) : (
                      <FileText className="w-5 h-5 text-red-400" />
                    )}
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-sm text-slate-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {results[index] && (
                      results[index].success ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Upload Progress */}
            {uploading && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Processing files...</span>
                  <span className="text-sm text-slate-400">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 bg-slate-700" />
              </div>
            )}
            
            {/* Upload Button */}
            {!uploading && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={uploadFiles}
                  className="premium-button"
                  disabled={files.length === 0}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Process {files.length} File{files.length !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Enhanced Results Cards */}
      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Processing Results</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">Success Rate:</span>
              <span className="text-sm font-medium text-green-400">
                {results.filter(r => r.success).length}/{results.length} ({Math.round((results.filter(r => r.success).length / results.length) * 100)}%)
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {results.map((result, index) => (
              <Card key={index} className={`premium-card border-2 transition-all duration-300 hover:scale-105 ${
                result.success 
                  ? 'border-green-500/30 hover:border-green-500/50' 
                  : 'border-red-500/30 hover:border-red-500/50'
              }`}>
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {result.success ? (
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                          <XCircle className="w-5 h-5 text-red-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-white truncate max-w-48">
                          {files[index]?.name}
                        </h4>
                        <p className="text-sm text-slate-400">
                          {result.success ? 'Successfully Processed' : 'Processing Failed'}
                        </p>
                      </div>
                    </div>
                                         <div className="text-right">
                       <div className="text-xs text-slate-400">Processing Time</div>
                       <div className="text-sm font-medium text-white">
                         {result.data?.processingTime ? `${(result.data.processingTime / 1000).toFixed(1)}s` : 'N/A'}
                       </div>
                     </div>
                  </div>

                  {result.success && result.data && (
                    <div className="space-y-4">
                                             {/* Invoice Summary */}
                       <div className="bg-slate-800/50 rounded-lg p-4">
                         <h5 className="text-sm font-medium text-slate-300 mb-3">Invoice Summary</h5>
                         <div className="grid grid-cols-2 gap-3 text-sm">
                           <div>
                             <span className="text-slate-400">Client:</span>
                             <p className="text-white font-medium truncate">
                               {result.data.structuredData?.client_id || result.data.structuredData?.company || result.data.invoice?.client?.name || "Unknown"}
                             </p>
                           </div>
                           <div>
                             <span className="text-slate-400">Invoice #:</span>
                             <p className="text-white font-medium">
                               {result.data.invoice?.invoiceNumber || result.data.structuredData?.invoiceNumber || "N/A"}
                             </p>
                           </div>
                           <div>
                             <span className="text-slate-400">Company:</span>
                             <p className="text-white font-medium truncate">
                               {result.data.structuredData?.company || result.data.invoice?.client?.name || "Unknown"}
                             </p>
                           </div>
                           <div>
                             <span className="text-slate-400">Currency:</span>
                             <p className="text-white font-medium">
                               {result.data.invoice?.currency || result.data.structuredData?.line_items?.[0]?.currency || "USD"}
                             </p>
                           </div>
                         </div>
                       </div>

                       {/* Line Items */}
                       {(result.data.structuredData?.line_items || result.data.invoice?.lineItems) && (result.data.structuredData?.line_items?.length > 0 || result.data.invoice?.lineItems?.length > 0) && (
                         <div className="bg-slate-800/50 rounded-lg p-4">
                           <div className="flex items-center justify-between mb-3">
                             <h5 className="text-sm font-medium text-slate-300">Line Items</h5>
                             <span className="text-xs text-slate-400">
                               {(result.data.structuredData?.line_items || result.data.invoice?.lineItems)?.length} item{(result.data.structuredData?.line_items || result.data.invoice?.lineItems)?.length !== 1 ? 's' : ''}
                             </span>
                           </div>
                           <div className="space-y-2 max-h-32 overflow-y-auto">
                             {(result.data.structuredData?.line_items || result.data.invoice?.lineItems)?.map((item: any, itemIndex: number) => (
                               <div key={itemIndex} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                                 <div className="flex-1 min-w-0">
                                   <p className="text-sm text-white truncate">{item.description}</p>
                                   <p className="text-xs text-slate-400">
                                     Qty: {item.quantity} × {(item.unitPrice || item.unit_price)?.toLocaleString()}
                                   </p>
                                 </div>
                                 <div className="text-right ml-2">
                                   <p className="text-sm font-medium text-white">
                                     {(item.amount || item.total)?.toLocaleString()}
                                   </p>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </div>
                       )}

                       {/* Total Amount */}
                       <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-500/30">
                         <div className="flex items-center justify-between">
                           <span className="text-sm font-medium text-slate-300">Total Amount</span>
                           <span className="text-xl font-bold text-white">
                             {result.data.invoice?.currency || result.data.structuredData?.line_items?.[0]?.currency || "USD"} {
                               (result.data.invoice?.totalAmount || 
                                result.data.structuredData?.line_items?.reduce((sum: number, item: any) => sum + (item.amount || 0), 0) ||
                                result.data.invoice?.lineItems?.reduce((sum: number, item: any) => sum + (item.total || 0), 0) ||
                                0).toLocaleString()
                             }
                           </span>
                         </div>
                       </div>

                      {/* Processing Details */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-800/30 rounded p-2">
                          <span className="text-slate-400">Status:</span>
                          <p className="text-green-400 font-medium">Completed</p>
                        </div>
                        <div className="bg-slate-800/30 rounded p-2">
                          <span className="text-slate-400">File Size:</span>
                          <p className="text-white font-medium">{formatFileSize(files[index]?.size || 0)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-medium text-red-400">Processing Error</span>
                      </div>
                      <p className="text-sm text-red-300">{result.error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Stats */}
          <Card className="premium-card bg-gradient-to-r from-slate-800/50 to-slate-700/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {results.length}
                  </div>
                  <div className="text-sm text-slate-400">Total Files</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {results.filter(r => r.success).length}
                  </div>
                  <div className="text-sm text-slate-400">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {results.filter(r => !r.success).length}
                  </div>
                  <div className="text-sm text-slate-400">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.round((results.filter(r => r.success).length / results.length) * 100)}%
                  </div>
                  <div className="text-sm text-slate-400">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}