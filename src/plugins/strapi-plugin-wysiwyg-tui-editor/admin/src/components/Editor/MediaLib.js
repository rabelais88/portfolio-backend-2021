import React, { useEffect } from 'react';
import { prefixFileUrlWithBackendUrl, useLibrary } from '@strapi/helper-plugin';

export default function MediaLib({ isOpen, onClose, editor }) {
  const { components } = useLibrary();
  const MediaLibDialog = components['media-library'];

  function handleSelectAssets(files) {
    if (!editor) {
      console.error('editor instance not found');
      return;
    }

    // content of files
    // [
    //   {
    //     id: 2,
    //     name: 'Screen Shot 2022-01-27 at 17.56.58.png',
    //     alternativeText: 'Screen Shot 2022-01-27 at 17.56.58.png',
    //     caption: 'Screen Shot 2022-01-27 at 17.56.58.png',
    //     width: 580,
    //     height: 252,
    //     formats: {
    //       small: {
    //         ext: '.png',
    //         url: 'https://sungryeol-portfolio-dev.s3.ap-northeast-2.amazonaws.com/small_Screen_Shot_2022_01_27_at_17_56_58_6948a6b623.png',
    //         hash: 'small_Screen_Shot_2022_01_27_at_17_56_58_6948a6b623',
    //         mime: 'image/png',
    //         name: 'small_Screen Shot 2022-01-27 at 17.56.58.png',
    //         path: null,
    //         size: 29.53,
    //         width: 500,
    //         height: 217,
    //       },
    //       thumbnail: {
    //         ext: '.png',
    //         url: 'https://sungryeol-portfolio-dev.s3.ap-northeast-2.amazonaws.com/thumbnail_Screen_Shot_2022_01_27_at_17_56_58_6948a6b623.png',
    //         hash: 'thumbnail_Screen_Shot_2022_01_27_at_17_56_58_6948a6b623',
    //         mime: 'image/png',
    //         name: 'thumbnail_Screen Shot 2022-01-27 at 17.56.58.png',
    //         path: null,
    //         size: 11.76,
    //         width: 245,
    //         height: 106,
    //       },
    //     },
    //     hash: 'Screen_Shot_2022_01_27_at_17_56_58_6948a6b623',
    //     ext: '.png',
    //     mime: 'image/png',
    //     size: 15.97,
    //     url: 'https://sungryeol-portfolio-dev.s3.ap-northeast-2.amazonaws.com/Screen_Shot_2022_01_27_at_17_56_58_6948a6b623.png',
    //     previewUrl: null,
    //     provider: 'aws-s3',
    //     provider_metadata: null,
    //     createdAt: '2022-01-27T14:34:50.657Z',
    //     updatedAt: '2022-01-27T14:34:50.657Z',
    //   },
    // ];
    
    const re = new RegExp(process.env.STRAPI_ADMIN_AWS_S3, 'i') 
    const s3ToCdn = (url ='') => url.replace(re, process.env.STRAPI_ADMIN_AWS_CDN);
    const formattedFiles = files.map((f) => ({
      alt: f.alternativeText || f.name,
      url: s3ToCdn(prefixFileUrlWithBackendUrl(f.url)),
      mime: f.mime,
      width: f.width,
      height: f.height,
      caption: f.caption,
      alt: f.alternativeText,
    }));
    formattedFiles.forEach(({ url, alt = '', width, height, caption = '' }) => {
      // to restore add image feature, uncomment this
      // editor.exec('AddImage', {
      //   imageUrl: url,
      //   altText: alt,
      // });
      const options = [];
      if (caption !== '') options.push(`caption="${caption}"`);
      if (alt !== '') options.push(`alt="${alt}"`);
      const strOptions = options.join(' ');
      editor.insertText(
        `<img src="${url}" width="${width}" height="${height}" ${strOptions} />`
      );
      editor.insertText('\n');
    });
    onClose();
  }

  // This is a hack to modify the media dialog's z-index
  useEffect(() => {
    if (!isOpen) return;
    let timer;
    async function waitForModal() {
      return new Promise((r) => {
        timer = setTimeout(() => {
          const modalRoot = document
            .getElementById('asset-dialog-title')
            ?.closest('div[data-react-portal="true"]').firstChild;
          if (modalRoot) {
            r(modalRoot);
          } else {
            return waitForModal();
          }
        }, 10);
      });
    }
    waitForModal().then((modalRoot) => {
      modalRoot.style.zIndex = '10';
    });
    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  return isOpen ? (
    <MediaLibDialog onClose={onClose} onSelectAssets={handleSelectAssets} />
  ) : null;
}
