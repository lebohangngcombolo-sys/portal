/**
 * File upload primitive.
 *
 * Presents a drop zone + file picker. The `onChange` callback receives
 * the File object — the caller is responsible for the actual upload
 * (typically via a presigned URL from the backend).
 */
import { useRef, useState } from 'react';
import styled from 'styled-components';

export function FileUpload({
  label,
  accept = '*',
  maxSizeBytes = 25 * 1024 * 1024,
  onChange,
  error,
  required,
  className,
}) {
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [filename, setFilename] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    setLocalError(null);
    if (!file) return;
    if (file.size > maxSizeBytes) {
      setLocalError(`File is too large (max ${(maxSizeBytes / 1024 / 1024).toFixed(1)} MB)`);
      return;
    }
    setFilename(file.name);
    onChange?.(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const displayError = error || localError;

  return (
    <Wrapper className={className}>
      {label && (
        <Label>
          {label}
          {required && <Required aria-hidden="true">*</Required>}
        </Label>
      )}
      <DropZone
        dragging={dragging}
        error={Boolean(displayError)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {filename ? (
          <Filename>{filename}</Filename>
        ) : (
          <span>Click to upload or drag a file here</span>
        )}
      </DropZone>
      {displayError && <ErrorText>{displayError}</ErrorText>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
`;

const Required = styled.span`
  color: #ef4444;
  margin-left: 4px;
`;

const DropZone = styled.div`
  padding: 24px;
  border: 2px dashed
    ${({ error, dragging }) => (error ? '#ef4444' : dragging ? '#0b5fff' : '#d1d5db')};
  border-radius: 8px;
  background: ${({ dragging }) => (dragging ? '#eef3ff' : '#ffffff')};
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    border-color: #0b5fff;
    background: #eef3ff;
  }
`;

const Filename = styled.span`
  color: #0b1220;
  font-weight: 500;
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
`;