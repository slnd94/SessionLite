import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { confirmable } from 'react-confirm';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

const ConfirmDialog = ({show, proceed, cancel, confirmation, options, t}) => {
  return (
    <Modal isOpen={show} toggle={() => cancel()}>
      <ModalHeader toggle={() => cancel()}>{options.confirmHeaderText || t('Are you sure?')}</ModalHeader>
      <ModalBody>
        <div className={'mb-3'}>
          {confirmation || t('Are you sure?')}
        </div>
        <div className={'text-right'}>
          <Button color="primary" autoFocus className={'mr-2'} onClick={() => proceed()}>{options.proceedLabel || t('Yes')}</Button>
          <Button color="secondary" onClick={() => cancel()}>{options.cancelLabel || t('No')}</Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

ConfirmDialog.propTypes = {
  show: PropTypes.bool,            // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func,         // from confirmable. call to close the dialog with promise resolved.
  cancel: PropTypes.func,          // from confirmable. call to close the dialog with promise rejected.
  dismiss: PropTypes.func,         // from confirmable. call to only close the dialog.
  confirmation: PropTypes.string,  // arguments of your confirm function
  options: PropTypes.object,        // arguments of your confirm function
  t: PropTypes.func
};

ConfirmDialog.defaultProps = {
  options: {}
};

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
export default translate(['translations'])(confirmable(ConfirmDialog));
