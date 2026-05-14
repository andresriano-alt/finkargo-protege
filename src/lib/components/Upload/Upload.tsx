import React, { useRef, useState } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { primary, secondary, quaternary, gray, error, success, fontFamily } from '../../tokens';

export interface UploadFile {
  id: string;
  name: string;
  size: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress?: number;
  errorMessage?: string;
}

export interface UploadProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  files?: UploadFile[];
  onFilesChange?: (files: File[]) => void;
  onRemoveFile?: (id: string) => void;
  onDownloadFile?: (id: string) => void;
  onPreviewFile?: (id: string) => void;
  className?: string;
}

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const CloudPlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 13v4M10 15h4" stroke={quaternary.main} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7.5 19a4.5 4.5 0 01-1.5-8.7A6 6 0 0118 9a4.5 4.5 0 013.375 7.5" stroke={quaternary.main} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PaperclipIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ transform: 'rotate(-30deg)' }}>
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M7 13l3.5 3.5L17 9" stroke={success.main} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 4v10m0 0l-3.5-3.5M12 14l3.5-3.5M5 18h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EyeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const TrashIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
});

const Dropzone = styled('div')<{ ownerState: { dragging: boolean; disabled: boolean } }>(
  ({ ownerState }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '32px 16px',
    border: `1px dashed ${secondary.light}`,
    borderRadius: '8px',
    background: gray.white,
    cursor: ownerState.disabled ? 'not-allowed' : 'pointer',
    textAlign: 'center',
    transition: 'border-color 150ms ease',
    outline: 'none',

    ...(!ownerState.disabled && {
      '&:hover, &:focus-visible': {
        borderColor: secondary.main,
      },
    }),

    ...(ownerState.dragging && {
      borderColor: secondary.main,
      background: primary[50],
    }),

    ...(ownerState.disabled && {
      opacity: 0.5,
    }),
  })
);

const NativeFileInput = styled('input')({
  display: 'none',
});

const DropzoneText = styled('span')({
  fontFamily,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.4,
  color: gray[400],
});

const DropzoneLink = styled('span')({
  fontFamily,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.4,
  color: secondary.main,
  textDecoration: 'underline',
  display: 'block',
});

const FileList = styled('ul')({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

const FileItem = styled('li')<{ ownerState: { status: UploadFile['status'] } }>(({ ownerState }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  border: `1px solid ${secondary.light}`,
  borderRadius: '8px',
  background: primary[50],

  ...(ownerState.status === 'error' && {
    borderColor: error.main,
    background: error.ultraLight,
  }),

  ...(ownerState.status === 'success' && {
    borderColor: success.main,
    background: success.ultraLight,
  }),
}));

const FileIconWrapper = styled('span')({
  display: 'inline-flex',
  flexShrink: 0,
});

const FileInfo = styled('div')({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const FileName = styled('span')({
  fontFamily,
  fontSize: '14px',
  fontWeight: 400,
  color: primary.dark,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const ErrorMsg = styled('span')({
  fontFamily,
  fontSize: '14px',
  fontWeight: 400,
  color: primary.dark,
  lineHeight: 1.4,
});

const ProgressTrack = styled('div')({
  height: '3px',
  background: gray[200],
  borderRadius: '8px',
  overflow: 'hidden',
  width: '100%',
});

const ProgressFill = styled('div')<{ ownerState: { progress: number } }>(({ ownerState }) => ({
  height: '100%',
  width: `${ownerState.progress}%`,
  background: `linear-gradient(90deg, ${quaternary.main} 0%, ${secondary.main} 90%)`,
  borderRadius: '100px',
  transition: 'width 200ms ease',
}));

const ActionsRow = styled('div')({
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
  flexShrink: 0,
});

const SpinnerSvg = styled('svg')({
  animation: `${spin} 0.8s linear infinite`,
});

const ActionButton = styled('button')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: primary.dark,
  flexShrink: 0,
  width: '24px',
  height: '24px',
  transition: 'opacity 150ms ease',
  '&:hover': { opacity: 0.7 },
});

export const Upload: React.FC<UploadProps> = ({
  accept,
  multiple = false,
  disabled = false,
  files = [],
  onFilesChange,
  onRemoveFile,
  onDownloadFile,
  onPreviewFile,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || disabled) return;
    onFilesChange?.(Array.from(fileList));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <Wrapper className={className}>
      <Dropzone
        ownerState={{ dragging, disabled }}
        onClick={handleClick}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Área de carga de archivos"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      >
        <NativeFileInput
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
          aria-hidden="true"
          tabIndex={-1}
        />
        <CloudPlusIcon />
        <div>
          <DropzoneText>Arrastra y suelta tus archivos o </DropzoneText>
          <DropzoneLink>haz clic aquí para subirlos</DropzoneLink>
        </div>
      </Dropzone>

      {files.length > 0 && (
        <FileList>
          {files.map((file) => (
            <FileItem key={file.id} ownerState={{ status: file.status }}>
              <FileIconWrapper>
                {file.status === 'success'
                  ? <CheckIcon />
                  : <PaperclipIcon color={file.status === 'error' ? error.main : secondary.main} />
                }
              </FileIconWrapper>

              <FileInfo>
                {file.status === 'error' && file.errorMessage
                  ? <ErrorMsg>{file.errorMessage}</ErrorMsg>
                  : <FileName>{file.name}</FileName>
                }
                {file.status === 'uploading' && (
                  <ProgressTrack>
                    <ProgressFill ownerState={{ progress: file.progress ?? 0 }} />
                  </ProgressTrack>
                )}
              </FileInfo>

              {file.status === 'uploading' && (
                <ActionsRow>
                  <SpinnerSvg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="6" stroke={secondary.main} strokeWidth="1.5" strokeDasharray="25" strokeDashoffset="8" strokeLinecap="round" />
                  </SpinnerSvg>
                  {onRemoveFile && (
                    <ActionButton type="button" onClick={() => onRemoveFile(file.id)} aria-label={`Eliminar ${file.name}`}>
                      <TrashIcon />
                    </ActionButton>
                  )}
                </ActionsRow>
              )}

              {(file.status === 'idle' || file.status === 'success') && (
                <ActionsRow>
                  {onDownloadFile && (
                    <ActionButton type="button" onClick={() => onDownloadFile(file.id)} aria-label={`Descargar ${file.name}`}>
                      <DownloadIcon />
                    </ActionButton>
                  )}
                  {onPreviewFile && (
                    <ActionButton type="button" onClick={() => onPreviewFile(file.id)} aria-label={`Ver ${file.name}`}>
                      <EyeIcon />
                    </ActionButton>
                  )}
                  {onRemoveFile && (
                    <ActionButton type="button" onClick={() => onRemoveFile(file.id)} aria-label={`Eliminar ${file.name}`}>
                      <TrashIcon />
                    </ActionButton>
                  )}
                </ActionsRow>
              )}
            </FileItem>
          ))}
        </FileList>
      )}
    </Wrapper>
  );
};

export default Upload;
