import React, { Component } from 'react';
import MultiSelect from 'react-native-multiple-select';

export class MultiSelectComponent extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    selectedItems: this.props.selectedItems,
  };

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems });
    this.props.select(selectedItems);
  };

  render() {
    const { selectedItems } = this.state;

    return (
      <MultiSelect
        items={this.props.items}
        uniqueKey="id"
        ref={component => {
          this.multiSelect = component;
        }}
        onSelectedItemsChange={this.onSelectedItemsChange}
        selectedItems={selectedItems}
        fixedHeight={true}
        selectText="Pick collaborators"
        searchInputPlaceholderText="Search users..."
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#000"
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        displayKey="name"
        searchInputStyle={{ color: '#CCC' }}
        submitButtonColor="#db55e5"
        submitButtonText="Save"
        hideSubmitButton={true}
      />
    );
  }
}
