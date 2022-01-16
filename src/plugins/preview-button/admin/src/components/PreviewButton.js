import React from 'react';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';

const PreviewButton = () => {
  const { slug, modifiedData, isCreatingEntry } = useCMEditViewDataManager();
  if (slug !== 'api::post.post') return null;
  if (isCreatingEntry) return <div>cannot preview until saved</div>;
  const { uid } = modifiedData;
  // https://docs.strapi.io/developer-docs/latest/developer-resources/plugin-api-reference/admin-panel.html#available-actions
  // The admin panel supports dotenv variables.
  // All variables defined in a .env file and prefixed by STRAPI_ADMIN_ are available while customizing the admin panel through process.env.
  const url = `${process.env.STRAPI_ADMIN_PREVIEW_HOST_URL}/api/post-preview?preview=${process.env.STRAPI_ADMIN_PREVIEW_KEY}&uid=${uid}`;
  return (
    <a className="preview-button" href={url}>
      preview this post
    </a>
  );
};

export default PreviewButton;
