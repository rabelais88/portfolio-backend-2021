import React from 'react';
import {
  ModalLayout,
  ModalHeader,
  ModalBody,
} from '@strapi/design-system/ModalLayout';
import { Typography } from '@strapi/design-system/Typography';

const BODY_STYLE = {
  maxHeight: `calc(100vh - 4rem)`,
};
export default function Flyout({
  isOpen,
  onClose,
  header,
  children,
  name,
  style,
}) {
  const titleId = `${name}-flyout-title`;
  return isOpen ? (
    <ModalLayout onClose={onClose} labelledBy={titleId} style={style}>
      <ModalHeader>
        <Typography
          fontWeight="bold"
          textColor="neutral800"
          as="h2"
          id={titleId}
        >
          {header}
        </Typography>
      </ModalHeader>
      <ModalBody style={BODY_STYLE}>{children}</ModalBody>
    </ModalLayout>
  ) : null;
}
