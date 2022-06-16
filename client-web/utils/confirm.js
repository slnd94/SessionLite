import { createConfirmation } from 'react-confirm';
import ConfirmDialog from '../components/ConfirmDialog';

const confirm = createConfirmation(ConfirmDialog);

export default function(confirmation, options) {
  // You can pass whatever you want to the component. These arguments will be your Component's props
  return confirm({ confirmation, options });
}
