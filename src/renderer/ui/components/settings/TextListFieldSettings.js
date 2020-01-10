import React, { Component, PropTypes } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { memoize } from 'lodash';

import SettingsProvider from '../generic/SettingsProvider';

class TListField extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    settingsKey: PropTypes.string.isRequired,
    setSetting: PropTypes.func.isRequired,
    muiTheme: PropTypes.object,
    dependsOnSettingsKey: PropTypes.string,
    placeholder: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      newValue: '',
    };
  }

  onChange = (event, value) => {
    this.setState({ newValue: value });
  }

  onAdd = () => {
    if (this.state.newValue === '') { return; }

    const currentValue = Settings.get(this.props.settingsKey, []);
    if (!currentValue.includes(this.state.newValue)) {
      this.props.setSetting(
        this.props.settingsKey,
        Settings.get(this.props.settingsKey, []).concat(this.state.newValue),
      );
    }

    this.setState({ newValue: '' });
  }

  onRemove = memoize((index) => () => {
    const currentValue = Settings.get(this.props.settingsKey, []);
    Settings.set(
      this.props.settingsKey,
      currentValue.slice(0, index).concat(currentValue.slice(index + 1)),
    );
  });

  render() {
    const { dependsOnSettingsKey } = this.props;
    if (dependsOnSettingsKey && !this.props[dependsOnSettingsKey]) {
      return null;
    }

    const values = Settings.get(this.props.settingsKey, []);
    if (typeof values === 'string') {
      Settings.set(this.props.settingsKey, [values]);
      return null;
    }

    return (
      <List>
        {values.map((value, i) => (
          <ListItem
            key={value}
            primaryText={value}
            rightIconButton={
              <RaisedButton
                onTouchTap={this.onRemove(i)}
                primary
              >
                <i className="material-icons" style={{ verticalAlign: 'middle' }}>clear</i>
              </RaisedButton>
            }
          />
        ))}
        <ListItem
          disabled
          primaryText={
            <TextField
              id={`test-field-for-${this.props.settingsKey}`}
              label={this.props.label}
              value={this.state.newValue}
              onChange={this.onChange}
              placeholder={this.props.placeholder}
            />
          }
          rightIconButton={
            <RaisedButton
              onTouchTap={this.onAdd}
              primary
            >
              <i className="material-icons" style={{ verticalAlign: 'middle' }}>add</i>
            </RaisedButton>
          }
        />
      </List>
    );
  }
}

const ThemedTListField = muiThemeable()(TListField);

export default class TextListFieldSettings extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    settingsKey: PropTypes.string.isRequired,
    dependsOnSettingsKey: PropTypes.string,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    placeholder: '',
  };

  render() {
    const textFieldProps = {
      label: this.props.label,
      settingsKey: this.props.settingsKey,
      dependsOnSettingsKey: this.props.dependsOnSettingsKey,
      placeholder: this.props.placeholder,
    };
    const keys = [this.props.settingsKey];
    if (this.props.dependsOnSettingsKey) {
      keys.push(this.props.dependsOnSettingsKey);
    }
    return (
      <SettingsProvider
        component={ThemedTListField}
        componentProps={textFieldProps}
        keys={keys}
        defaults={{}}
      />
    );
  }
}
