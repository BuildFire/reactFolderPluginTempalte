import React from 'react';
import { hot } from 'react-hot-loader';
import PluginsField from './components/PluginsField';

class Content extends React.Component {
  state = {
    _buildfire: {
      plugins: {
        dataType: 'pluginInstance',
        data: []
      }
    },
    content: {
      title: '',
      loadAllPlugins: false
    },
    design: {
      backgroundImage: null,
      lgBackgroundImage: null
    },
    pluginList: [],
    default: true
  };

  componentDidMount() {
    this.getWithDynamicData()
    .then((result) => {
      if (result.data && !Object.keys(result.data).length) {
        this.saveData(this.state);
      } else {
        this.setState((prevState) => this.getTheNewState({ ...prevState, ...result.data }));
      }
    })
    .catch((err) => {
      console.error('Error saving data:', err);
    });
  }

  getTheNewState = (data) => {
    const pluginList = data._buildfire.plugins.data.map((instanceId) => {
      const pluginModel = data._buildfire.plugins.result
        .filter((plugin) => plugin.data.instanceId === instanceId);
      return pluginModel.length ? pluginModel[0] : {};
    });
    const newState = {
      ...data,
      pluginList
    };
    return newState;
  }

  getWithDynamicData = () => {
    return new Promise((success, reject) => {
      return buildfire.datastore.getWithDynamicData('content', (err, result) => {
        if (err) return reject(err);
        return success(result);
      });
    });
  }

  saveData = (data) => {
    return new Promise((success, reject) => {
      return buildfire.datastore.save(data, 'content', (err, result) => {
        console.warn(err, result, '::saveData::');
        if (err) return reject(err);
        return success(result);
      });
    });
  }

  sendMessageToWidget = (...params) => {
    return buildfire.messaging.sendMessageToWidget(params);
  }

  handleOnChangeTitle = (event) => {
    const newState = {
      ...this.state,
      content: {
        title: event.currentTarget.value
      }
    };
    this.setState(() => this.getTheNewState(newState));
    this.saveData(newState).catch((err) => {
      console.error('Error saving data:', err);
    });
  }

  handleClickTitle = (plugin) => {
    const pluginData = {
      pluginId: plugin.data.pluginTypeId,
      instanceId: plugin.data.instanceId,
      folderName: plugin.data.folderName,
      title: plugin.data.title
    };
    this.sendMessageToWidget({
      name: 'OPEN_PLUGIN',
      message: {
        data: pluginData
      }
    });
  }

  confirmNotification =  (params) => {
    return new Promise((success, reject) => {
      return buildfire.notifications.confirm(params, () => {
        if (!params) return reject();
        return success();
      });
    });
  }

  handleRemoveItem = (event, pluginToDelete) => {
    this.confirmNotification({
      title: 'Remove Feature',
      message: '<p>Are you sure you want to do this?</p><p class="margin-zero">Note: If you would like to add it again, you can do so by clicking the button above.</p>',
      buttonLabels: ['Delete', 'Cancel'],
      target: event.currentTarget
    })
    .then(() => {
      const newState = {
        ...this.state,
        _buildfire: {
          plugins: {
            data: this.state._buildfire.plugins.data.filter(
              pluginInstanceId => (
                pluginInstanceId !== pluginToDelete.data.instanceId
              )
            ),
            dataType: 'pluginInstance'
          }
        }
      };
      return this.saveData(newState);
    })
    .then(() => {
      return this.getWithDynamicData();
    })
    .then((result) => {
      this.setState((prevState) => this.getTheNewState({ ...prevState, ...result.data }));
    })
    .catch((err) => {
      console.error('Error saving data:', err);
    });
  }

  handleChangeLoadAll = () => {
    const newState = {
      ...this.state,
      content: {
        ...this.state.content,
        loadAllPlugins: !this.state.content.loadAllPlugins
      }
    };
    this.saveData(newState).then(() => {
      return this.getWithDynamicData();
    })
    .then((result) => {
      this.setState((prevState) => this.getTheNewState({ ...prevState, ...result.data }));
    })
    .catch((err) => {
      console.error('Error saving data:', err);
    });
  }

  handleUpdateSort = (pluginList) => {
    const newState = {
      ...this.state,
      _buildfire: {
        plugins: {
          ...this.state._buildfire.plugins,
          data: pluginList.map((plugin) => (
            plugin.data.instanceId
          ))
        }
      }
    };
    this.setState(() => this.getTheNewState(newState));
    this.saveData(newState)
    .then(() => {
      return this.getWithDynamicData();
    })
    .then((result) => {
      this.setState((prevState) => this.getTheNewState({ ...prevState, ...result.data }));
    })
    .catch((err) => {
      console.error('Error saving data:', err);
    });
  }

  handleChangePlugins = (value) => {
    const newState = {
      ...this.state,
      _buildfire: {
        plugins: {
          data: [
            ...this.state._buildfire.plugins.data,
            ...value.pluginList.map(plugin => plugin.instanceId)
          ],
          dataType: 'pluginInstance'
        }
      }
    };
    this.saveData(newState).then(() => {
      return this.getWithDynamicData();
    })
    .then((result) => {
      this.setState((prevState) => this.getTheNewState({ ...prevState, ...result.data }));
    })
    .catch((err) => {
      console.error('Error saving data:', err);
    });
  }

  render() {
    const {
      content: {
        title,
        loadAllPlugins
      },
      pluginList
    } = this.state;

    return (
      <div>
        <div className="item clearfix row">
          <div className="col-md-12 section-title">
            <span className="top-line"></span>
            <h4 className="h4">Section 1</h4>
          </div>
        </div>
        <div className="item clearfix row">
          <div className="col-md-3 pull-left">
            <span className="field-name">Title</span>
          </div>
          <div className="col-md-9 pull-left">
            <input
              value={title}
              onChange={this.handleOnChangeTitle}
              type="text"
              className="form-control"
            />
          </div>
        </div>
        <hr className="none" />
        <div className="margin-top-30">
          <PluginsField
            value={{
              loadAllPlugins,
              pluginList
            }}
            onClickTitle={this.handleClickTitle}
            onRemoveItem={this.handleRemoveItem}
            onChangeLoadAll={this.handleChangeLoadAll}
            onUpdateSort={this.handleUpdateSort}
            onChangePlugins={this.handleChangePlugins}
          />
        </div>
      </div>
    );
  }
}

export default hot(module)(() => <Content />);
