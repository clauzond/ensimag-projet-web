import React, { Component } from 'react';
import MultiSelect from 'react-native-multiple-select';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  searchInput: {
    color: '#CCC',
  },
});

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
        selectText={this.props.selectText}
        searchInputPlaceholderText={this.props.searchInputPlaceholderText}
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#000"
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        displayKey="name"
        searchInputStyle={styles.searchInput}
        submitButtonColor="#db55e5"
        submitButtonText="Save"
        hideSubmitButton={true}
        single={this.props.singleSelect}
      />
    );
  }
}
