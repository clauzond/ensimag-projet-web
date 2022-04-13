import React from 'react';
import Overlay from 'react-native-modal-overlay';

export class PopupComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Overlay
        animationType={'slideInDown'}
        visible={this.props.visible}
        onClose={this.props.onClose}
        closeOnTouchOutside
        animationDuration={350}
      >
        {this.props.children}
      </Overlay>
    );
  }
}
