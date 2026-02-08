import * as React from "react"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "./progress"

export interface FileUploadProps extends Omit<DropzoneOptions, "onDrop"> {
    onFilesChange?: (files: File[]) => void
    value?: File[]
    className?: string
    uploadProgress?: number
    uploading?: boolean
    error?: string
}

export function FileUpload({
    onFilesChange,
    value = [],
    className,
    uploadProgress,
    uploading = false,
    error,
    maxSize = 5242880, // 5MB default
    accept,
    multiple = false,
    ...dropzoneOptions
}: FileUploadProps) {
    const [files, setFiles] = React.useState<File[]>(value)

    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            const newFiles = multiple ? [...files, ...acceptedFiles] : acceptedFiles
            setFiles(newFiles)
            onFilesChange?.(newFiles)
        },
        [files, multiple, onFilesChange]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxSize,
        accept,
        multiple,
        ...dropzoneOptions,
    })

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
        onFilesChange?.(newFiles)
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
    }

    return (
        <div className={cn("w-full", className)}>
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer",
                    "hover:border-primary hover:bg-primary/5",
                    isDragActive && "border-primary bg-primary/10",
                    error && "border-error bg-error/5",
                    uploading && "opacity-60 pointer-events-none",
                    files.length > 0 && "border-success"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                    {uploading ? (
                        <>
                            <Upload className="h-10 w-10 text-primary animate-pulse" />
                            <div className="space-y-2 w-full max-w-xs">
                                <p className="text-sm text-muted-foreground">Uploading...</p>
                                <Progress value={uploadProgress} showLabel size="md" />
                            </div>
                        </>
                    ) : files.length > 0 ? (
                        <>
                            <CheckCircle className="h-10 w-10 text-success" />
                            <div>
                                <p className="text-sm font-medium">
                                    {files.length} file{files.length > 1 ? "s" : ""} selected
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Click or drag to add {multiple ? "more" : "another"}
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <Upload className="h-10 w-10 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">
                                    {isDragActive ? "Drop files here" : "Click to upload or drag and drop"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {accept ? `Accepted: ${Object.keys(accept).join(", ")}` : "Any file type"}
                                    {maxSize && ` (Max ${formatFileSize(maxSize)})`}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 mt-2 text-error text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}

            {/* File List */}
            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <File className="h-5 w-5 text-primary flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                disabled={uploading}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
