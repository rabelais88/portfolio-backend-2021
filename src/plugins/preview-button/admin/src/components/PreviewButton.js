import React from 'react';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';

const PreviewButton = () => {
  const { slug, modifiedData, isCreatingEntry } = useCMEditViewDataManager();
  if (slug !== 'api::post.post') return null;
  if (isCreatingEntry) return <div>cannot preview until saved</div>;
  const { uid } = modifiedData;
  const url = `${PREVIEW_HOST_URL}/api/post-preview?preview=${PREVIEW_KEY}&uid=${uid}`;
  return (
    <a class="preview-button" href={url}>
      preview this post
    </a>
  );
};

export default PreviewButton;
