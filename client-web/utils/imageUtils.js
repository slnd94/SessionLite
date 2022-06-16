
const resizeImage = (image, maxWidth, maxHeight, quality, metadata, callback) => {
  const canvas = document.createElement('canvas');

  let width = image.width;
  let height = image.height;

  if (width > height) {
    if (width > maxWidth) {
      height = Math.round(height * maxWidth / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round(width * maxHeight / height);
      height = maxHeight;
    }
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);
  canvas.toBlob(blob => {
    // assign a url to the blob so it can be displayed in browser if needed
    blob.preview = (window.URL || window.webkitURL).createObjectURL(blob);
    // assign other metadata
    blob.lastModified = metadata.lastModified;
    blob.lastModifiedDate = metadata.lastModifiedDate;
    blob.name = metadata.name;
    callback(blob);
  }, 'image/png', quality);
};


export const resize = (file, maxWidth, maxHeight, quality, callback) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const dataUrl = event.target.result;

    const image = new Image();
    image.src = dataUrl;
    image.onload = () => {
      resizeImage(image, maxWidth, maxHeight, quality, {
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.name
      }, callback);
    };
  };
};

