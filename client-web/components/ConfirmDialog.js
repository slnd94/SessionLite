import React from "react";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { confirmable } from "react-confirm";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useTranslation } from "next-i18next";

const ConfirmDialog = ({ show, proceed, cancel, confirmation, options }) => {
  const { t } = useTranslation("common");
  return (
    <Modal isOpen={show} toggle={() => cancel()}>
      <ModalHeader toggle={() => cancel()}>
        {options.confirmHeaderText || t("Are you sure?")}
      </ModalHeader>
      <ModalBody>
        <div className={"mb-3"}>
          {confirmation || t("Are you sure?")}
          {options?.listItems?.length > 0 ? (
            <ul className="my-4">
              {options.listItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            null
          )}
        </div>
        <div className="d-md-flex justify-content-md-end">
          <Button
            color="primary"
            autoFocus
            className="px-4 btn-block-md-down"
            onClick={() => proceed()}
          >
            {options.proceedLabel || t("Yes")}
          </Button>
          <Button
            color="default"
            className="px-4 ms-md-2 btn-block-md-down"
            onClick={() => cancel()}
          >
            {options.cancelLabel || t("No")}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

ConfirmDialog.propTypes = {
  show: PropTypes.bool, // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func, // from confirmable. call to close the dialog with promise resolved.
  cancel: PropTypes.func, // from confirmable. call to close the dialog with promise rejected.
  dismiss: PropTypes.func, // from confirmable. call to only close the dialog.
  confirmation: PropTypes.string, // arguments of your confirm function
  options: PropTypes.object,
};

ConfirmDialog.defaultProps = {
  options: {},
};

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
export default confirmable(ConfirmDialog);
